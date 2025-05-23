import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import { fetchUserAttributes } from "@aws-amplify/auth";
import { View, Text, Table, TableHead, TableRow, TableCell, TableBody, Flex, Card, Button } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState<Schema["Transaction"]["type"][]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 10;

    useEffect(() => {
        const fetchUserAndTransactions = async () => {
            try {
                setLoading(true);
                const userAttributes = await fetchUserAttributes();
                const loggedInUserId = userAttributes?.sub;
                if (loggedInUserId) {
                    setUserId(loggedInUserId);
                }

                const { data } = await client.models.Transaction.list({
                    filter: {
                        or: [
                            { buyerId: { eq: loggedInUserId } }, 
                            { sellerId: { eq: loggedInUserId } }
                        ]
                    },
                    authMode: "userPool"
                });

                console.log("Fetched Transactions:", data);
                setTransactions(data ?? []);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndTransactions();
    }, []);

    // Filter transactions based on active tab
    const getFilteredTransactions = () => {
        if (!userId) return [];
        switch (activeTab) {
            case "purchased":
                return transactions.filter(tx => tx.buyerId === userId);
            case "sold":
                return transactions.filter(tx => tx.sellerId === userId);
            case "all":
            default:
                return transactions;
        }
    };

    const filteredTransactions = getFilteredTransactions();
    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
    const totalPages = Math.max(1, Math.ceil(transactions.length / transactionsPerPage));

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <View style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",  //  Centers everything
            minHeight: "100vh",    //  Ensures the page stretches properly
            width: "100%", 
            maxWidth: "1200px",    //  Restricts width to prevent page from being too wide
            margin: "0 auto"       //  Centers the content
           }}>
            <View style={{
                background: "#030637",
                padding: "1rem",
                //position: "absolute",
                top: "100px",  // Adjusted from 80px to 100px to move it down
                zIndex: 10,               // Ensures it's above the table
            }}>
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
                    <Card
                        style={{backgroundColor: "#030637"}}    
                    >
                        <Flex direction="column" gap="1rem" color="#030637">
                            <Text fontSize="2xl" fontWeight="bold" color="white">Transaction History</Text>
                            
                            {/* Custom Tabs - Using Buttons */}
                            <Flex gap="1rem">
                                <Button 
                                    backgroundColor="#910A67"
                                    color="white"
                                    onClick={() => setActiveTab("all")}
                                >
                                    All Transactions
                                </Button>
                                <Button 
                                    backgroundColor="#910A67"
                                    color="white"
                                    onClick={() => setActiveTab("purchased")}
                                >
                                    Energy Purchased
                                </Button>
                                <Button 
                                    backgroundColor="#910A67"
                                    color="white"
                                    onClick={() => setActiveTab("sold")}
                                >
                                    Energy Sold
                                </Button>
                            </Flex>

                            {/* Transactions Table */}
                            {loading ? (
                                <Flex justifyContent="center" padding="2rem" style={{backgroundColor: "#3C0753"}}>
                                    <Text >Loading transactions...</Text>
                                </Flex>
                            ) : (
                                <View style={{ overflowX: "auto" }}>
                                    <Table variation="bordered" style={{ width: "100%", borderCollapse: "collapse", color:"white"}}>
                                        <TableHead style={{
                                            position: "sticky",
                                            top: "0px",  // ✅ Keeps it at the top of the scrolling container
                                            backgroundColor: "#3C0753",
                                            zIndex: 10,  // ✅ Ensures it's above table content
                                        }}>
                                            <TableRow>
                                                <TableCell color="white">Date</TableCell>
                                                <TableCell color="white">Transaction Type</TableCell>
                                                <TableCell color="white">Energy (kWh)</TableCell>
                                                <TableCell color="white">Price per kWh</TableCell>
                                                <TableCell color="white">Total Price ($)</TableCell>
                                                <TableCell color="white">{userId ? "Counterparty" : "Parties"}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {currentTransactions.length === 0 ? (
                                                <TableRow>
                                                    <TableCell color="white" colSpan={6} textAlign="center">No transactions found.</TableCell>
                                                </TableRow>
                                            ) : (
                                                currentTransactions.map((tx) => (
                                                    <TableRow key={tx.id}>
                                                        <TableCell color="white">{formatDate(tx.createdAt)}</TableCell>
                                                        <TableCell color="white">
                                                            {tx.buyerId === userId ? "Purchase" : "Sale"}
                                                        </TableCell>
                                                        <TableCell color="white">{tx.energy} kWh</TableCell>
                                                        <TableCell color="white">${tx.pricePerKwh.toFixed(2)}</TableCell>
                                                        <TableCell color="white">${tx.totalPrice.toFixed(2)}</TableCell>
                                                        <TableCell >
                                                            {tx.buyerId === userId ? (
                                                                <Text color="white">Purchased from: {tx.buyerId}</Text>
                                                            ) : (
                                                                <Text color="white">Sold to: {tx.buyerId}</Text>
                                                            )} 
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </View>
                            )}
                        </Flex>
                    </Card>
                </View>
                <Flex justifyContent="center" marginTop="1rem" style={{zIndex:5}}>
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
            </View>
        </View>
    );
};

export default TransactionHistory;
