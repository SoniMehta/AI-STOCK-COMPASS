// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { AppLayout } from "@/components/layout/AppLayout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import {
//   TrendingUp,
//   TrendingDown,
//   Search,
//   Brain,
//   Star,
//   Clock,
//   ArrowRight,
//   Globe,
//   Loader2,
//   BarChart3,
// } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { watchlist, history, stocks } from "@/lib/api";
// import { useAuth } from "@/contexts/AuthContext";

// const POPULAR_TICKERS = ["AAPL", "MSFT", "GOOGL", "TSLA", "NFLX", "META"];

// export default function Dashboard() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [watchlistStocks, setWatchlistStocks] = useState<any[]>([]);
//   const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
//   const [popularStocks, setPopularStocks] = useState<any[]>([]);
//   const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(true);
//   const [isLoadingHistory, setIsLoadingHistory] = useState(true);
//   const [isLoadingPopular, setIsLoadingPopular] = useState(true);

//   useEffect(() => {
//     fetchWatchlist();
//     fetchHistory();
//     fetchPopularStocks();
//   }, []);

//   const fetchPopularStocks = async () => {
//     try {
//       setIsLoadingPopular(true);
//       const stocksData = await Promise.all(
//         POPULAR_TICKERS.map(async (ticker) => {
//           try {
//             const quote = await stocks.getQuote(ticker);
//             return {
//               ticker,
//               price: quote.c,
//               change: quote.d,
//               changePercent: quote.dp,
//             };
//           } catch (error) {
//             console.error(`Error fetching ₹{ticker}:`, error);
//             return null;
//           }
//         })
//       );
//       setPopularStocks(stocksData.filter(Boolean));
//     } catch (error) {
//       console.error("Error fetching popular stocks:", error);
//     } finally {
//       setIsLoadingPopular(false);
//     }
//   };

//   const fetchWatchlist = async () => {
//     try {
//       setIsLoadingWatchlist(true);
//       const data = await watchlist.getAll();
//       setWatchlistStocks(data.slice(0, 5)); // Show top 5
//     } catch (error: any) {
//       console.error("Error fetching watchlist:", error);
//       setWatchlistStocks([]);
//     } finally {
//       setIsLoadingWatchlist(false);
//     }
//   };

//   const fetchHistory = async () => {
//     try {
//       setIsLoadingHistory(true);
//       const data = await history.getAll(3, 0);
//       setRecentAnalyses(data);
//     } catch (error: any) {
//       console.error("Error fetching history:", error);
//       setRecentAnalyses([]);
//     } finally {
//       setIsLoadingHistory(false);
//     }
//   };

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/stock?ticker=₹{searchQuery.toUpperCase()}`);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//     const diffDays = Math.floor(diffHours / 24);

//     if (diffHours < 1) return "Just now";
//     if (diffHours < 24) return `₹{diffHours} hour₹{diffHours > 1 ? "s" : ""} ago`;
//     if (diffDays === 1) return "Yesterday";
//     if (diffDays < 7) return `₹{diffDays} days ago`;
//     return date.toLocaleDateString();
//   };

//   return (
//     <AppLayout>
//       <div className="space-y-8">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
//         >
//           <div>
//             <h1 className="text-2xl font-bold text-foreground">
//               Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {user?.full_name || user?.username || "Investor"}
//             </h1>
//             <p className="text-muted-foreground">Here's what's happening in the markets today</p>
//           </div>
//           <Link to="/insights">
//             <Button className="gradient-primary text-primary-foreground gap-2">
//               <Brain className="h-4 w-4" />
//               Analyze a Stock
//             </Button>
//           </Link>
//         </motion.div>

//         {/* Popular Stocks - Real-time */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-card rounded-xl shadow-card border border-border"
//         >
//           <div className="p-4 border-b border-border flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="p-2 rounded-lg bg-primary/10">
//                 <Globe className="h-5 w-5 text-primary" />
//               </div>
//               <div>
//                 <h2 className="font-semibold text-foreground">Popular Stocks</h2>
//                 <p className="text-sm text-muted-foreground">Live Market Data</p>
//               </div>
//             </div>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={fetchPopularStocks}
//               disabled={isLoadingPopular}
//             >
//               {isLoadingPopular ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
//             </Button>
//           </div>

//           <div className="p-4">
//             {isLoadingPopular ? (
//               <div className="flex items-center justify-center py-8">
//                 <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
//                 {popularStocks.map((stock) => (
//                   <Link
//                     key={stock.ticker}
//                     to={`/stock?ticker=₹{stock.ticker}`}
//                     className="p-3 rounded-lg border border-border hover:border-primary hover:bg-secondary/30 transition-all cursor-pointer"
//                   >
//                     <div className="font-bold text-sm text-foreground mb-1">{stock.ticker}</div>
//                     <div className="text-lg font-semibold text-foreground mb-1">
//                       ₹{stock.price?.toFixed(2) || "N/A"}
//                     </div>
//                     <div
//                       className={`text-xs font-medium flex items-center gap-1 ₹{
//                         stock.change >= 0 ? "text-success" : "text-destructive"
//                       }`}
//                     >
//                       {stock.change >= 0 ? (
//                         <TrendingUp className="h-3 w-3" />
//                       ) : (
//                         <TrendingDown className="h-3 w-3" />
//                       )}
//                       {stock.changePercent >= 0 ? "+" : ""}
//                       {stock.changePercent?.toFixed(2)}%
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         </motion.div>

//         {/* Search Bar */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           <form onSubmit={handleSearch} className="relative">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//             <Input
//               placeholder="Search for a stock (e.g., AAPL, TSLA, GOOGL)..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="h-14 pl-12 pr-32 text-lg bg-card border-border"
//             />
//             <Button
//               type="submit"
//               className="absolute right-2 top-1/2 -translate-y-1/2 gradient-primary text-primary-foreground"
//             >
//               <Search className="h-4 w-4 mr-2" />
//               Search
//             </Button>
//           </form>
//         </motion.div>

//         {/* Main Content Grid */}
//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Watchlist */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="lg:col-span-2 bg-card rounded-xl shadow-card border border-border"
//           >
//             <div className="p-4 border-b border-border flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Star className="h-5 w-5 text-warning" />
//                 <h2 className="font-semibold text-foreground">Your Watchlist</h2>
//               </div>
//               <Link to="/watchlist" className="text-sm text-accent hover:underline flex items-center gap-1">
//                 View all <ArrowRight className="h-3 w-3" />
//               </Link>
//             </div>
//             <div className="divide-y divide-border">
//               {isLoadingWatchlist ? (
//                 <div className="p-8 flex items-center justify-center">
//                   <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
//                 </div>
//               ) : watchlistStocks.length === 0 ? (
//                 <div className="p-8 text-center text-muted-foreground">
//                   <Star className="h-12 w-12 mx-auto mb-3 opacity-20" />
//                   <p className="font-medium mb-2">Your watchlist is empty</p>
//                   <p className="text-sm mb-4">Start adding stocks to track your favorites</p>
//                   <Link to="/watchlist">
//                     <Button size="sm" className="gradient-primary text-primary-foreground">
//                       Go to Watchlist
//                     </Button>
//                   </Link>
//                 </div>
//               ) : (
//                 watchlistStocks.map((stock) => (
//                   <div
//                     key={stock.id}
//                     className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center font-bold text-sm text-foreground">
//                         {stock.ticker.slice(0, 2)}
//                       </div>
//                       <div>
//                         <p className="font-semibold text-foreground">{stock.ticker}</p>
//                         <p className="text-sm text-muted-foreground">{stock.company_name || "Company"}</p>
//                       </div>
//                     </div>
//                     <Link to={`/insights?stock=₹{stock.ticker}`}>
//                       <Button variant="ghost" size="sm" className="text-accent">
//                         <Brain className="h-4 w-4" />
//                       </Button>
//                     </Link>
//                   </div>
//                 ))
//               )}
//             </div>
//           </motion.div>

//           {/* Recent Analyses */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="bg-card rounded-xl shadow-card border border-border"
//           >
//             <div className="p-4 border-b border-border flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Clock className="h-5 w-5 text-muted-foreground" />
//                 <h2 className="font-semibold text-foreground">Recent Analyses</h2>
//               </div>
//               <Link to="/history" className="text-sm text-accent hover:underline flex items-center gap-1">
//                 View all <ArrowRight className="h-3 w-3" />
//               </Link>
//             </div>
//             <div className="divide-y divide-border">
//               {isLoadingHistory ? (
//                 <div className="p-8 flex items-center justify-center">
//                   <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
//                 </div>
//               ) : recentAnalyses.length === 0 ? (
//                 <div className="p-8 text-center text-muted-foreground">
//                   <Clock className="h-12 w-12 mx-auto mb-3 opacity-20" />
//                   <p className="font-medium mb-2">No analyses yet</p>
//                   <p className="text-sm mb-4">Start analyzing stocks to see your history</p>
//                   <Link to="/insights">
//                     <Button size="sm" className="gradient-primary text-primary-foreground">
//                       Analyze a Stock
//                     </Button>
//                   </Link>
//                 </div>
//               ) : (
//                 recentAnalyses.map((analysis) => (
//                   <div key={analysis.id} className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="font-semibold text-foreground">{analysis.ticker}</span>
//                       <span
//                         className={`text-xs px-2 py-1 rounded-full ₹{
//                           analysis.recommendation === "BUY"
//                             ? "bg-success/10 text-success"
//                             : analysis.recommendation === "SELL"
//                             ? "bg-destructive/10 text-destructive"
//                             : "bg-warning/10 text-warning"
//                         }`}
//                       >
//                         {analysis.recommendation}
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between text-sm text-muted-foreground">
//                       <span className="capitalize">{analysis.analysis_type.replace("_", " ")}</span>
//                       <span>{formatDate(analysis.created_at)}</span>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </motion.div>
//         </div>

//         {/* Quick Stats */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//           className="grid grid-cols-2 lg:grid-cols-4 gap-4"
//         >
//           <Card className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Total Analyses</p>
//                 <p className="text-2xl font-bold text-foreground">
//                   {isLoadingHistory ? "..." : recentAnalyses.length}
//                 </p>
//               </div>
//               <Brain className="h-8 w-8 text-primary opacity-50" />
//             </div>
//           </Card>
//           <Card className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Watchlist Stocks</p>
//                 <p className="text-2xl font-bold text-foreground">
//                   {isLoadingWatchlist ? "..." : watchlistStocks.length}
//                 </p>
//               </div>
//               <Star className="h-8 w-8 text-warning opacity-50" />
//             </div>
//           </Card>
//           <Card className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Stocks Analyzed</p>
//                 <p className="text-2xl font-bold text-foreground">
//                   {isLoadingHistory ? "..." : new Set(recentAnalyses.map((a: any) => a.ticker)).size}
//                 </p>
//               </div>
//               <BarChart3 className="h-8 w-8 text-primary opacity-50" />
//             </div>
//           </Card>
//           <Card className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Account Status</p>
//                 <p className="text-2xl font-bold text-success">Active</p>
//               </div>
//               <Globe className="h-8 w-8 text-success opacity-50" />
//             </div>
//           </Card>
//         </motion.div>
//       </div>
//     </AppLayout>
//   );
// }

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Brain,
  Star,
  Clock,
  ArrowRight,
  Globe,
  Loader2,
  BarChart3,
  LayoutGrid,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { watchlist, history, stocks } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

// FIXED: Removed Indian stocks that cause 404 errors on Polygon's Free Tier
const EXPLORE_COMPANIES = [
  { name: "Apple", ticker: "AAPL" },
  { name: "Tesla", ticker: "TSLA" },
  { name: "Microsoft", ticker: "MSFT" },
  { name: "Nvidia", ticker: "NVDA" },
  { name: "Alphabet", ticker: "GOOGL" },
  { name: "Amazon", ticker: "AMZN" },
  { name: "Meta", ticker: "META" },
  { name: "Netflix", ticker: "NFLX" },
];

// FIXED: Reduced to 3 stocks so the Dashboard doesn't exhaust the 5/min limit!
const POPULAR_TICKERS = ["AAPL", "TSLA", "MSFT"];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [watchlistStocks, setWatchlistStocks] = useState<any[]>([]);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [popularStocks, setPopularStocks] = useState<any[]>([]);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);

  useEffect(() => {
    fetchWatchlist();
    fetchHistory();
    fetchPopularStocks();
  }, []);

  const fetchPopularStocks = async () => {
    try {
      setIsLoadingPopular(true);
      const stocksData = await Promise.all(
        POPULAR_TICKERS.map(async (ticker) => {
          try {
            const quote = await stocks.getQuote(ticker);
            return {
              ticker,
              price: quote.c,
              change: quote.d,
              changePercent: quote.dp,
            };
          } catch (error) {
            console.error(`Error fetching ${ticker}:`, error);
            return null;
          }
        })
      );
      setPopularStocks(stocksData.filter(Boolean));
    } catch (error) {
      console.error("Error fetching popular stocks:", error);
    } finally {
      setIsLoadingPopular(false);
    }
  };

  const fetchWatchlist = async () => {
    try {
      setIsLoadingWatchlist(true);
      const data = await watchlist.getAll();
      setWatchlistStocks(data.slice(0, 5)); 
    } catch (error: any) {
      console.error("Error fetching watchlist:", error);
      setWatchlistStocks([]);
    } finally {
      setIsLoadingWatchlist(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const data = await history.getAll(3, 0);
      setRecentAnalyses(data);
    } catch (error: any) {
      console.error("Error fetching history:", error);
      setRecentAnalyses([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/stock?ticker=${searchQuery.trim().toUpperCase()}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {user?.full_name || user?.username || "Investor"}
            </h1>
            <p className="text-muted-foreground">Welcome to AI Stock Compass. Track, learn, and analyze.</p>
          </div>
          <Link to="/insights">
            <Button className="gradient-primary text-primary-foreground gap-2">
              <Brain className="h-4 w-4" />
              Analyze a Stock
            </Button>
          </Link>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Enter US stock ticker (e.g., AAPL, NVDA, TSLA)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 pl-12 pr-32 text-lg bg-card border-border shadow-sm focus:ring-2 focus:ring-primary"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 gradient-primary text-primary-foreground"
            >
              Search
            </Button>
          </form>
        </motion.div>

        {/* Beginner Quick Explore Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 px-1">
            <LayoutGrid className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Quick Explore (US Markets)</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {EXPLORE_COMPANIES.map((company) => (
              <button
                key={company.ticker}
                onClick={() => navigate(`/stock?ticker=${company.ticker}`)}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-xs text-primary mb-2 group-hover:scale-110 transition-transform">
                  {company.ticker.slice(0, 2)}
                </div>
                <span className="text-xs font-bold text-foreground">{company.ticker}</span>
                <span className="text-[10px] text-muted-foreground truncate w-full text-center">{company.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Popular Stocks - Real-time */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl shadow-card border border-border"
        >
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Live Market Movers</h2>
                <p className="text-sm text-muted-foreground">Real-time tracking</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchPopularStocks}
              disabled={isLoadingPopular}
            >
              {isLoadingPopular ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
            </Button>
          </div>

          <div className="p-4">
            {isLoadingPopular ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {popularStocks.map((stock) => (
                  <Link
                    key={stock.ticker}
                    to={`/stock?ticker=${stock.ticker}`}
                    className="p-3 rounded-lg border border-border hover:border-primary hover:bg-secondary/30 transition-all cursor-pointer"
                  >
                    <div className="font-bold text-sm text-foreground mb-1">{stock.ticker}</div>
                    <div className="text-lg font-semibold text-foreground mb-1">
                      ₹{stock.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-xs font-medium flex items-center gap-1 ${
                        stock.change >= 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {stock.change >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {stock.changePercent >= 0 ? "+" : ""}
                      {stock.changePercent?.toFixed(2)}%
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Watchlist */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-card rounded-xl shadow-card border border-border"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-warning" />
                <h2 className="font-semibold text-foreground">Your Watchlist</h2>
              </div>
              <Link to="/watchlist" className="text-sm text-accent hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {isLoadingWatchlist ? (
                <div className="p-8 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : watchlistStocks.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium mb-2">Your watchlist is empty</p>
                  <p className="text-sm mb-4">Add your favorite stocks to track them here</p>
                  <Link to="/watchlist">
                    <Button size="sm" className="gradient-primary text-primary-foreground">
                      Add Stocks
                    </Button>
                  </Link>
                </div>
              ) : (
                watchlistStocks.map((stock) => (
                  <div
                    key={stock.id}
                    className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center font-bold text-sm text-foreground">
                        {stock.ticker.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{stock.ticker}</p>
                        <p className="text-sm text-muted-foreground">{stock.company_name || "Company"}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/stock?ticker=${stock.ticker}`)} className="text-primary">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/insights?stock=${stock.ticker}`)} className="text-accent">
                          <Brain className="h-4 w-4" />
                        </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Recent Analyses */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl shadow-card border border-border"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold text-foreground">Recent Analyses</h2>
              </div>
              <Link to="/history" className="text-sm text-accent hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {isLoadingHistory ? (
                <div className="p-8 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : recentAnalyses.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium mb-2">No history</p>
                  <p className="text-sm mb-4">Recent AI insights will appear here</p>
                </div>
              ) : (
                recentAnalyses.map((analysis) => (
                  <div key={analysis.id} className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => navigate(`/stock?ticker=${analysis.ticker}`)}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">{analysis.ticker}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          analysis.recommendation === "BUY"
                            ? "bg-success/10 text-success"
                            : analysis.recommendation === "SELL"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {analysis.recommendation}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="capitalize">{analysis.analysis_type.replace("_", " ")}</span>
                      <span>{formatDate(analysis.created_at)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="p-4 border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Analyses</p>
                <p className="text-xl font-bold text-foreground">
                  {isLoadingHistory ? "..." : recentAnalyses.length}
                </p>
              </div>
              <Brain className="h-6 w-6 text-primary opacity-50" />
            </div>
          </Card>
          <Card className="p-4 border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Watchlist</p>
                <p className="text-xl font-bold text-foreground">
                  {isLoadingWatchlist ? "..." : watchlistStocks.length}
                </p>
              </div>
              <Star className="h-6 w-6 text-warning opacity-50" />
            </div>
          </Card>
          <Card className="p-4 border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active Tickers</p>
                <p className="text-xl font-bold text-foreground">
                  {isLoadingHistory ? "..." : new Set(recentAnalyses.map((a: any) => a.ticker)).size}
                </p>
              </div>
              <BarChart3 className="h-6 w-6 text-primary opacity-50" />
            </div>
          </Card>
          <Card className="p-4 border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-xl font-bold text-success">Verified</p>
              </div>
              <Globe className="h-6 w-6 text-success opacity-50" />
            </div>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}