// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Link } from "react-router-dom";
// import { AppLayout } from "@/components/layout/AppLayout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Star,
//   Search,
//   Brain,
//   Trash2,
//   Plus,
//   X,
//   Loader2,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { watchlist as watchlistAPI, stocks } from "@/lib/api";

// interface WatchlistStock {
//   id: number;
//   ticker: string;
//   company_name: string;
//   added_at: string;
//   quote?: any;
// }

// export default function Watchlist() {
//   const [watchlist, setWatchlist] = useState<WatchlistStock[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newTicker, setNewTicker] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAdding, setIsAdding] = useState(false);
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchWatchlist();
//   }, []);

//   const fetchWatchlist = async () => {
//     try {
//       setIsLoading(true);
//       const data = await watchlistAPI.getAll();

//       // Fetch quotes for each stock
//       const stocksWithQuotes = await Promise.all(
//         data.map(async (item: WatchlistStock) => {
//           try {
//             const quote = await stocks.getQuote(item.ticker);
//             return { ...item, quote };
//           } catch (error) {
//             console.error(`Error fetching quote for ₹{item.ticker}:`, error);
//             return { ...item, quote: null };
//           }
//         })
//       );

//       setWatchlist(stocksWithQuotes);
//     } catch (error: any) {
//       console.error("Error fetching watchlist:", error);
//       toast({
//         title: "Error loading watchlist",
//         description: error.message || "Could not load your watchlist",
//         variant: "destructive",
//       });
//       setWatchlist([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filteredWatchlist = watchlist.filter(
//     (stock) =>
//       stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (stock.company_name && stock.company_name.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   const handleRemove = async (ticker: string) => {
//     try {
//       await watchlistAPI.remove(ticker);
//       setWatchlist(watchlist.filter((s) => s.ticker !== ticker));
//       toast({
//         title: "Removed from watchlist",
//         description: `₹{ticker} has been removed from your watchlist.`,
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error removing stock",
//         description: error.message || "Could not remove stock from watchlist",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleAdd = async () => {
//     if (!newTicker.trim()) return;

//     const ticker = newTicker.toUpperCase();
//     const exists = watchlist.some((s) => s.ticker === ticker);

//     if (exists) {
//       toast({
//         title: "Already in watchlist",
//         description: `₹{ticker} is already in your watchlist.`,
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       setIsAdding(true);

//       // First, try to get quote to validate ticker exists
//       const quote = await stocks.getQuote(ticker);

//       // Add to watchlist
//       const newStock = await watchlistAPI.add(ticker);

//       // Add to local state with quote
//       setWatchlist([...watchlist, { ...newStock, quote }]);
//       setNewTicker("");
//       setShowAddModal(false);

//       toast({
//         title: "Added to watchlist",
//         description: `₹{ticker} has been added to your watchlist.`,
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error adding stock",
//         description: error.message || "Could not add stock to watchlist. Make sure the ticker is valid.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//     }).format(price);
//   };

//   const formatMarketCap = (marketCap: number) => {
//     if (marketCap >= 1e12) return `₹₹{(marketCap / 1e12).toFixed(2)}T`;
//     if (marketCap >= 1e9) return `₹₹{(marketCap / 1e9).toFixed(2)}B`;
//     if (marketCap >= 1e6) return `₹₹{(marketCap / 1e6).toFixed(2)}M`;
//     return `₹₹{marketCap}`;
//   };

//   const formatVolume = (volume: number) => {
//     if (volume >= 1e9) return `₹{(volume / 1e9).toFixed(2)}B`;
//     if (volume >= 1e6) return `₹{(volume / 1e6).toFixed(2)}M`;
//     if (volume >= 1e3) return `₹{(volume / 1e3).toFixed(2)}K`;
//     return volume.toString();
//   };

//   return (
//     <AppLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
//         >
//           <div>
//             <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
//               <Star className="h-6 w-6 text-warning" />
//               My Watchlist
//             </h1>
//             <p className="text-muted-foreground">
//               {isLoading ? "Loading..." : `₹{watchlist.length} stock₹{watchlist.length !== 1 ? 's' : ''} tracked`}
//             </p>
//           </div>
//           <Button
//             onClick={() => setShowAddModal(true)}
//             className="gradient-primary text-primary-foreground gap-2"
//           >
//             <Plus className="h-4 w-4" />
//             Add Stock
//           </Button>
//         </motion.div>

//         {/* Search */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//         >
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search your watchlist..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//         </motion.div>

//         {/* Watchlist Table */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-card rounded-xl shadow-card border border-border overflow-hidden"
//         >
//           {isLoading ? (
//             <div className="flex items-center justify-center py-12">
//               <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//             </div>
//           ) : watchlist.length === 0 ? (
//             <div className="text-center py-12">
//               <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
//               <h3 className="text-lg font-semibold text-foreground mb-2">Your watchlist is empty</h3>
//               <p className="text-muted-foreground mb-6">Add stocks to track your favorites and monitor their performance</p>
//               <Button
//                 onClick={() => setShowAddModal(true)}
//                 className="gradient-primary text-primary-foreground gap-2"
//               >
//                 <Plus className="h-4 w-4" />
//                 Add Your First Stock
//               </Button>
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-border bg-secondary/30">
//                       <th className="text-left p-4 text-sm font-semibold text-foreground">Stock</th>
//                       <th className="text-right p-4 text-sm font-semibold text-foreground">Price</th>
//                       <th className="text-right p-4 text-sm font-semibold text-foreground">Change</th>
//                       <th className="text-right p-4 text-sm font-semibold text-foreground hidden md:table-cell">Market Cap</th>
//                       <th className="text-right p-4 text-sm font-semibold text-foreground hidden lg:table-cell">Volume</th>
//                       <th className="text-right p-4 text-sm font-semibold text-foreground">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <AnimatePresence>
//                       {filteredWatchlist.map((stock, index) => (
//                         <motion.tr
//                           key={stock.id}
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           exit={{ opacity: 0, x: -20 }}
//                           transition={{ delay: index * 0.03 }}
//                           className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
//                         >
//                           <td className="p-4">
//                             <div className="flex items-center gap-3">
//                               <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center font-bold text-sm text-foreground">
//                                 {stock.ticker.slice(0, 2)}
//                               </div>
//                               <div>
//                                 <p className="font-semibold text-foreground">{stock.ticker}</p>
//                                 <p className="text-sm text-muted-foreground">
//                                   {stock.company_name || stock.quote?.name || "Company"}
//                                 </p>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="p-4 text-right">
//                             <span className="font-semibold text-foreground">
//                               {stock.quote?.c ? formatPrice(stock.quote.c) : "N/A"}
//                             </span>
//                           </td>
//                           <td className="p-4 text-right">
//                             {stock.quote?.dp !== undefined ? (
//                               <span
//                                 className={`inline-flex items-center gap-1 font-medium ₹{
//                                   stock.quote.dp >= 0 ? "text-success" : "text-destructive"
//                                 }`}
//                               >
//                                 {stock.quote.dp >= 0 ? "+" : ""}
//                                 {stock.quote.dp.toFixed(2)}%
//                               </span>
//                             ) : (
//                               <span className="text-muted-foreground">N/A</span>
//                             )}
//                           </td>
//                           <td className="p-4 text-right hidden md:table-cell">
//                             <span className="text-muted-foreground">
//                               {stock.quote?.marketCapitalization
//                                 ? formatMarketCap(stock.quote.marketCapitalization * 1e6)
//                                 : "N/A"}
//                             </span>
//                           </td>
//                           <td className="p-4 text-right hidden lg:table-cell">
//                             <span className="text-muted-foreground">
//                               {stock.quote?.volume ? formatVolume(stock.quote.volume) : "N/A"}
//                             </span>
//                           </td>
//                           <td className="p-4 text-right">
//                             <div className="flex items-center justify-end gap-2">
//                               <Link to={`/insights?stock=₹{stock.ticker}`}>
//                                 <Button variant="ghost" size="sm" className="text-accent">
//                                   <Brain className="h-4 w-4" />
//                                 </Button>
//                               </Link>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => handleRemove(stock.ticker)}
//                                 className="text-muted-foreground hover:text-destructive"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </td>
//                         </motion.tr>
//                       ))}
//                     </AnimatePresence>
//                   </tbody>
//                 </table>
//               </div>

//               {filteredWatchlist.length === 0 && (
//                 <div className="text-center py-12">
//                   <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
//                   <p className="text-muted-foreground">No stocks in your watchlist match your search.</p>
//                 </div>
//               )}
//             </>
//           )}
//         </motion.div>
//       </div>

//       {/* Add Stock Modal */}
//       <AnimatePresence>
//         {showAddModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
//             onClick={() => !isAdding && setShowAddModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.95, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-card rounded-xl p-6 shadow-lg border border-border w-full max-w-md"
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-foreground">Add to Watchlist</h2>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setShowAddModal(false)}
//                   disabled={isAdding}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//               <div className="space-y-4">
//                 <div>
//                   <Input
//                     placeholder="Enter stock ticker (e.g., AAPL)"
//                     value={newTicker}
//                     onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
//                     onKeyDown={(e) => e.key === "Enter" && !isAdding && handleAdd()}
//                     disabled={isAdding}
//                   />
//                   <p className="text-xs text-muted-foreground mt-2">
//                     Enter a valid stock ticker symbol to add it to your watchlist
//                   </p>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     className="flex-1"
//                     onClick={() => setShowAddModal(false)}
//                     disabled={isAdding}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     className="flex-1 gradient-primary text-primary-foreground"
//                     onClick={handleAdd}
//                     disabled={isAdding || !newTicker.trim()}
//                   >
//                     {isAdding ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         Adding...
//                       </>
//                     ) : (
//                       "Add Stock"
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </AppLayout>
//   );
// }
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Star,
  Search,
  Brain,
  Trash2,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { watchlist as watchlistAPI, stocks } from "@/lib/api";

interface WatchlistStock {
  id: number;
  ticker: string;
  company_name: string;
  added_at: string;
  quote?: any;
}

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistStock[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTicker, setNewTicker] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setIsLoading(true);
      const data = await watchlistAPI.getAll();

      // Fetch quotes for each stock
      const stocksWithQuotes = await Promise.all(
        data.map(async (item: WatchlistStock) => {
          try {
            const quote = await stocks.getQuote(item.ticker);
            return { ...item, quote };
          } catch (error) {
            console.error(`Error fetching quote for ${item.ticker}:`, error);
            return { ...item, quote: null };
          }
        })
      );

      setWatchlist(stocksWithQuotes);
    } catch (error: any) {
      console.error("Error fetching watchlist:", error);
      toast({
        title: "Error loading watchlist",
        description: error.message || "Could not load your watchlist",
        variant: "destructive",
      });
      setWatchlist([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWatchlist = watchlist.filter(
    (stock) =>
      stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (stock.company_name && stock.company_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleRemove = async (ticker: string) => {
    try {
      await watchlistAPI.remove(ticker);
      setWatchlist(watchlist.filter((s) => s.ticker !== ticker));
      toast({
        title: "Removed from watchlist",
        description: `${ticker} has been removed from your watchlist.`,
      });
    } catch (error: any) {
      toast({
        title: "Error removing stock",
        description: error.message || "Could not remove stock from watchlist",
        variant: "destructive",
      });
    }
  };

  const handleAdd = async () => {
    if (!newTicker.trim()) return;

    const ticker = newTicker.toUpperCase();
    const exists = watchlist.some((s) => s.ticker === ticker);

    if (exists) {
      toast({
        title: "Already in watchlist",
        description: `${ticker} is already in your watchlist.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAdding(true);

      // First, try to get quote to validate ticker exists
      const quote = await stocks.getQuote(ticker);

      // Add to watchlist
      const newStock = await watchlistAPI.add(ticker);

      // Add to local state with quote
      setWatchlist([...watchlist, { ...newStock, quote }]);
      setNewTicker("");
      setShowAddModal(false);

      toast({
        title: "Added to watchlist",
        description: `${ticker} has been added to your watchlist.`,
      });
    } catch (error: any) {
      toast({
        title: "Error adding stock",
        description: error.message || "Could not add stock to watchlist. Make sure the ticker is valid.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `₹${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `₹${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `₹${(marketCap / 1e6).toFixed(2)}M`;
    return `₹${marketCap}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
    return volume.toString();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Star className="h-6 w-6 text-warning" />
              My Watchlist
            </h1>
            <p className="text-muted-foreground">
              {isLoading ? "Loading..." : `${watchlist.length} stock${watchlist.length !== 1 ? 's' : ''} tracked`}
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="gradient-primary text-primary-foreground gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Stock
          </Button>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your watchlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Watchlist Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl shadow-card border border-border overflow-hidden"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : watchlist.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Your watchlist is empty</h3>
              <p className="text-muted-foreground mb-6">Add stocks to track your favorites and monitor their performance</p>
              <Button
                onClick={() => setShowAddModal(true)}
                className="gradient-primary text-primary-foreground gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Your First Stock
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Stock</th>
                      <th className="text-right p-4 text-sm font-semibold text-foreground">Price</th>
                      <th className="text-right p-4 text-sm font-semibold text-foreground">Change</th>
                      <th className="text-right p-4 text-sm font-semibold text-foreground hidden md:table-cell">Market Cap</th>
                      <th className="text-right p-4 text-sm font-semibold text-foreground hidden lg:table-cell">Volume</th>
                      <th className="text-right p-4 text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredWatchlist.map((stock, index) => (
                        <motion.tr
                          key={stock.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center font-bold text-sm text-foreground">
                                {stock.ticker.slice(0, 2)}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{stock.ticker}</p>
                                <p className="text-sm text-muted-foreground">
                                  {stock.company_name || stock.quote?.name || "Company"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <span className="font-semibold text-foreground">
                              {stock.quote?.c ? formatPrice(stock.quote.c) : "N/A"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {stock.quote?.dp !== undefined ? (
                              <span
                                className={`inline-flex items-center gap-1 font-medium ${
                                  stock.quote.dp >= 0 ? "text-success" : "text-destructive"
                                }`}
                              >
                                {stock.quote.dp >= 0 ? "+" : ""}
                                {stock.quote.dp.toFixed(2)}%
                              </span>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </td>
                          <td className="p-4 text-right hidden md:table-cell">
                            <span className="text-muted-foreground">
                              {stock.quote?.marketCapitalization
                                ? formatMarketCap(stock.quote.marketCapitalization * 1e6)
                                : "N/A"}
                            </span>
                          </td>
                          <td className="p-4 text-right hidden lg:table-cell">
                            <span className="text-muted-foreground">
                              {stock.quote?.volume ? formatVolume(stock.quote.volume) : "N/A"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link to={`/insights?stock=${stock.ticker}`}>
                                <Button variant="ghost" size="sm" className="text-accent">
                                  <Brain className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemove(stock.ticker)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {filteredWatchlist.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground">No stocks in your watchlist match your search.</p>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Add Stock Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
            onClick={() => !isAdding && setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-xl p-6 shadow-lg border border-border w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Add to Watchlist</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                  disabled={isAdding}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Enter stock ticker (e.g., AAPL)"
                    value={newTicker}
                    onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && !isAdding && handleAdd()}
                    disabled={isAdding}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Enter a valid stock ticker symbol to add it to your watchlist
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddModal(false)}
                    disabled={isAdding}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 gradient-primary text-primary-foreground"
                    onClick={handleAdd}
                    disabled={isAdding || !newTicker.trim()}
                  >
                    {isAdding ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Stock"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}