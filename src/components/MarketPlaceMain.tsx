import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import { fetchUserAttributes } from "@aws-amplify/auth";
import { Button, View, Text, Input, Label, Table, TableHead, TableRow, TableCell, TableBody, Flex } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

const MarketPlaceMain = () => {
  const [showForm, setShowForm] = useState(false);
  const [listings, setListings] = useState<Schema["Listing"]["type"][]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 10; // ✅ Change this to control number of rows per page

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userAttributes = await fetchUserAttributes();
        console.log("✅ Authenticated user attributes:", userAttributes);
      } catch (error) {
        console.error("❌ User is not logged in or authentication failed:", error);
      }
    };

    checkUser();
  }, []); // Runs once when the component mounts

  // ✅ Form state
  const [formData, setFormData] = useState({
    sellerId: "",
    sellerName: "",
    energy: "",
    pricePerKwh: "",
    location: "",
  });

  // ✅ Fetch listings from DynamoDB
  const fetchListings = async () => {
    try {
      
      const { data } = await client.models.Listing.list({
        authMode: "userPool"
      });
      console.log("Fetched Listings:", data); // Debugging
      setListings(data ?? []);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // ✅ Pagination Logic
  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = listings.slice(indexOfFirstListing, indexOfLastListing);
  const totalPages = Math.max(1, Math.ceil(listings.length / listingsPerPage));


  // ✅ Handle Form Submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      //const userAttributes = await fetchUserAttributes();
      //const ownerUsername = userAttributes?.sub;
      const totalPrice = parseFloat(formData.energy) * parseFloat(formData.pricePerKwh); // Calculate total price

      await client.models.Listing.create({
        sellerId: formData.sellerId,
        sellerName: formData.sellerName,
        energy: parseFloat(formData.energy),
        pricePerKwh: parseFloat(formData.pricePerKwh),
        totalPrice, // ✅ Now included
        location: formData.location,
        createdAt: new Date().toISOString(),
      });

      setShowForm(false); // Close form after submission
      fetchListings(); // Refresh listings
      console.log("Listing added successfully!");
    } catch (error) {
      console.error("Error adding listing:", error);
    }
  };

  interface Listing {
    id: string;
    totalPrice: number;
    //url: 'http://localhost:5173/success?listingId=${listingId}';
  }

  const handleBuyNow = async (listing: Listing) => {
    console.log("🛒 Buy Now clicked for listing:", listing);
    try {
        const response = await fetch(
            "https://iac1remhtj.execute-api.us-west-1.amazonaws.com/test",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    price: listing.totalPrice,  // Ensure this matches what Stripe expects
                    listingId: listing.id,
                    successUrl: `${window.location.origin}/success?listingId=${listing.id}`,
                    cancelUrl: `${window.location.origin}/marketplace`
                }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to create checkout session");
        }

        const session = await response.json();  // ✅ Get the full session response
        if (!session || !session.url) {
            throw new Error("Stripe session creation failed: No URL returned");
        }

        console.log("✅ Redirecting to Stripe Checkout:", session.url);
        window.location.href = session.url; // ✅ Correct way to redirect user to Stripe Checkout
    } catch (error) {
        console.error("❌ Error processing payment:", error);
    }
};


  return (
    <View style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center",  // ✅ Centers everything
      minHeight: "100vh",    // ✅ Ensures the page stretches properly
      width: "100%", 
      maxWidth: "1200px",    // ✅ Restricts width to prevent page from being too wide
      margin: "0 auto"       // ✅ Centers the content
     }}>
  
  {/* ✅ Keep "Add Listing" button fixed but move it down slightly */}
  <View style={{
    background: "#030637",
    padding: "1rem",
    position: "absolute",
    top: "100px",  // ✅ Adjusted from 80px to 100px to move it down
    zIndex: 10,               // ✅ Ensures it's above the table
  }}>
    <Button onClick={() => setShowForm(true)} 
      backgroundColor="#910A67" 
      color="white"
    >
      Add Listing
    </Button>
  </View>
  <View style={{
    width: "100%",
    marginTop: "360px",  // ✅ Pushes table down even more
  }}>
  {/* ✅ Scrollable Table Body (Only the content should scroll) */}
  <View style={{
    background: "#030637",
    padding: "1rem",
    overflowY: "auto",
    overflowX: "auto",
    maxHeight: "55vh",
    border: "1px solid #ccc",
    width: "100%",
    maxWidth: "90%",
    margin: "0 auto",
    borderRadius: "10px"
  }}>
    
    <Table variation="bordered" style={{ width: "100%", borderCollapse: "collapse" }}>
      
      {/* ✅ Fix Table Header Position */}
      <TableHead style={{
        position: "sticky",
        top: "0px",  // ✅ Keeps it at the top of the scrolling container
        backgroundColor: "#3C0753",
        zIndex: 10,  // ✅ Ensures it's above table content
      }}>
        <TableRow>
          <TableCell color="white">Seller</TableCell>
          <TableCell color="white">Energy (kWh)</TableCell>
          <TableCell color="white">Price per kWh</TableCell>
          <TableCell color="white">Total Price</TableCell>
          <TableCell color="white">Location</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {currentListings.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} textAlign="center" color="white">
              No listings available.
            </TableCell>
          </TableRow>
        ) : (
          currentListings.map((listing) => (
            <TableRow key={listing.id}>
              <TableCell color="white">{listing.sellerName}</TableCell>
              <TableCell color="white">{listing.energy} kWh</TableCell>
              <TableCell color="white">${listing.pricePerKwh.toFixed(2)}</TableCell>
              <TableCell color="white">${listing.totalPrice.toFixed(2)}</TableCell>
              <TableCell color="white">{listing.location}</TableCell>
              <TableCell>
                <Button 
                  onClick={() => handleBuyNow(listing)}
                  backgroundColor="#910A67"
                  color="white"
                >
                  Buy Now
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>

    </Table>
  </View>
  </View>

  {/* ✅ Pagination Stays Fixed Below Table */}
  <Flex justifyContent="center" marginTop="1rem" style={{zIndex: 5}}>
    <Button 
      color="white"
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      Previous
    </Button>
    <Text margin="0 1rem" color="white">Page {currentPage} of {totalPages}</Text>
    <Button 
      color="white"
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      Next
    </Button>
  </Flex>



      {/* ✅ Custom Modal Pop-up for Adding Listing */}
      {showForm && (
        <View style={modalStyle}>
          <View style={modalContentStyle}>
            <Text fontSize="1.5rem" fontWeight="bold" marginBottom="1rem">
              Add a New Listing
            </Text>
            
            {/* Form Fields */}
            <form onSubmit={handleSubmit}>
              <Label>Seller ID:</Label>
              <Input
                required
                value={formData.sellerId}
                onChange={(e) => setFormData({ ...formData, sellerId: e.target.value })}
              />

              <Label>Seller Name:</Label>
              <Input
                required
                value={formData.sellerName}
                onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
              />

              <Label>Energy (kWh):</Label>
              <Input
                required
                type="number"
                value={formData.energy}
                onChange={(e) => setFormData({ ...formData, energy: e.target.value })}
              />

              <Label>Price per kWh:</Label>
              <Input
                required
                type="number"
                value={formData.pricePerKwh}
                onChange={(e) => setFormData({ ...formData, pricePerKwh: e.target.value })}
              />

              <Label>Location:</Label>
              <Input
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />

              {/* Submit Button */}
              <Button type="submit" backgroundColor="#720455" color="white">
                Submit Listing
              </Button>

              {/* Close Button */}
              <Button onClick={() => setShowForm(false)} backgroundColor="gray">
                Cancel
              </Button>
            </form>
          </View>
        </View>
      )}
    </View>
  );
};

/* ✅ Basic Modal Styles */
const modalStyle = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  width: "400px",
  textAlign: "center" as const,
};

export default MarketPlaceMain;
