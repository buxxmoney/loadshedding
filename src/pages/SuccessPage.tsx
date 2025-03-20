import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import { fetchUserAttributes } from "@aws-amplify/auth";
import { View, Text, Button, Flex, Card } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasProcessed, setHasProcessed] = useState(false); // ✅ Prevent multiple executions

  useEffect(() => {
    const processTransaction = async () => {
      if (hasProcessed) return;  // ✅ Prevent function from running multiple times
      setHasProcessed(true);

      try {
        setIsProcessing(true);

        // ✅ Get listingId from URL params
        const listingId = searchParams.get("listingId");
        if (!listingId) {
          throw new Error("Listing ID not found in URL parameters");
        }

        // ✅ Fetch the listing details
        const { data: listing } = await client.models.Listing.get({ id: listingId });
        if (!listing) {
          throw new Error("Listing not found or already sold");
        }

        // ✅ Get current user info
        const userAttributes = await fetchUserAttributes();
        const buyerId = userAttributes.sub;
        if (!buyerId) {
          throw new Error("User not authenticated");
        }

        // ✅ Check if the transaction already exists using `id`
        const { data: existingTransactions } = await client.models.Transaction.list({
          filter: { buyerId: { eq: buyerId }, listingId: { eq: listingId } }
        });

        if (existingTransactions.length > 0) {
          console.log("✅ Transaction already exists, skipping duplicate insert.");
          setSuccess(true);
          return;
        }

        // ✅ Create a transaction record
        const newTransaction = await client.models.Transaction.create({
          sellerId: listing.sellerId,
          buyerId: buyerId,
          energy: listing.energy,
          pricePerKwh: listing.pricePerKwh,
          totalPrice: listing.totalPrice,
          createdAt: new Date().toISOString(),
          listingId: listingId
        });

        console.log("✅ Transaction created:", newTransaction);

        // ✅ DELETE the listing after successful transaction
        await client.models.Listing.delete({ id: listingId });

        console.log("✅ Transaction completed & listing removed from marketplace.");
        setSuccess(true);
      } catch (err) {
        console.error("❌ Error processing transaction:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsProcessing(false);
      }
    };

    processTransaction();
  }, []); // ✅ Ensures this runs only once on mount

  return (
    <View style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "2rem", backgroundColor: "#f5f5f5" }}>
      <Card style={{ maxWidth: "600px", width: "100%", padding: "2rem", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        {isProcessing ? (
          <Flex direction="column" alignItems="center" gap="1rem">
            <Text fontSize="xl" fontWeight="bold">Processing your transaction...</Text>
            <Text>Please don't close this window.</Text>
          </Flex>
        ) : success ? (
          <Flex direction="column" alignItems="center" gap="1rem">
            <Text fontSize="2xl" fontWeight="bold" color="#2e8b57">Payment Successful!</Text>
            <Text>Your energy purchase has been processed successfully.</Text>
            <Text>The listing has been removed from the marketplace.</Text>
            <Flex gap="1rem" marginTop="2rem">
              <Button onClick={() => navigate("/transactions")} backgroundColor="#910A67" color="white">
                View Transactions
              </Button>
              <Button onClick={() => navigate("/marketplace")} backgroundColor="#3C0753" color="white">
                Back to Marketplace
              </Button>
            </Flex>
          </Flex>
        ) : (
          <Flex direction="column" alignItems="center" gap="1rem">
            <Text fontSize="xl" fontWeight="bold" color="#dc3545">Transaction Error</Text>
            <Text>{error || "An error occurred while processing your transaction."}</Text>
            <Button onClick={() => navigate("/marketplace")} backgroundColor="#910A67" color="white" marginTop="1rem">
              Back to Marketplace
            </Button>
          </Flex>
        )}
      </Card>
    </View>
  );
};

export default SuccessPage;
