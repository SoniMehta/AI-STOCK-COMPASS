// import { useState, useEffect } from "react";
// import { useSearchParams, Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { AppLayout } from "@/components/layout/AppLayout";
// import { Button } from "@/components/ui/button";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer
// } from "recharts";
// import {
//   ArrowLeft,
//   TrendingUp,
//   TrendingDown,
//   Brain,
//   Star,
//   Loader2,
//   Calendar,
//   DollarSign,
//   BarChart3,
//   Activity,
// } from "lucide-react";
// import { stocks, watchlist } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";

// export default function StockDetails() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const ticker = searchParams.get("ticker")?.toUpperCase() || "";
//   const { toast } = useToast();

//   const [quote, setQuote] = useState<any>(null);
//   const [candles, setCandles] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoadingChart, setIsLoadingChart] = useState(true);
//   const [timeRange, setTimeRange] = useState<"1D" | "1W" | "1M" | "3M" | "1Y">("1M");
//   const [isInWatchlist, setIsInWatchlist] = useState(false);
//   const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false);

//   useEffect(() => {
//     if (ticker) {
//       fetchStockData();
//       checkWatchlist();
//     }
//   }, [ticker]);

//   useEffect(() => {
//     if (ticker) {
//       fetchCandles();
//     }
//   }, [ticker, timeRange]);

//   const fetchStockData = async () => {
//     try {
//       setIsLoading(true);
//       const data = await stocks.getQuote(ticker);
//       setQuote(data);
//     } catch (error: any) {
//       toast({
//         title: "Error loading stock data",
//         description: error.message || "Could not load stock information",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchCandles = async () => {
//     try {
//       setIsLoadingChart(true);

//       const now = Math.floor(Date.now() / 1000);
//       let from: number;
//       let resolution: "1" | "5" | "15" | "30" | "60" | "D" | "W" | "M" = "D";

//       switch (timeRange) {
//         case "1D":
//           from = now - (24 * 60 * 60);
//           resolution = "5";
//           break;
//         case "1W":
//           from = now - (7 * 24 * 60 * 60);
//           resolution = "30";
//           break;
//         case "1M":
//           from = now - (30 * 24 * 60 * 60);
//           resolution = "D";
//           break;
//         case "3M":
//           from = now - (90 * 24 * 60 * 60);
//           resolution = "D";
//           break;
//         case "1Y":
//           from = now - (365 * 24 * 60 * 60);
//           resolution = "W";
//           break;
//         default:
//           from = now - (30 * 24 * 60 * 60);
//           resolution = "D";
//       }

//       const data = await stocks.getCandles(ticker, resolution, from, now);

//       if (data.s === "ok" && data.t && data.t.length > 0) {
//         const chartData = data.t.map((timestamp: number, index: number) => ({
//           time: new Date(timestamp * 1000).toLocaleDateString("en-US", {
//             month: "short",
//             day: "numeric",
//           }),
//           price: data.c[index],
//           open: data.o[index],
//           high: data.h[index],
//           low: data.l[index],
//           volume: data.v[index],
//         }));
//         setCandles(chartData);
//       } else {
//         setCandles([]);
//         toast({
//           title: "No chart data",
//           description: "Chart data is not available for this stock",
//           variant: "destructive",
//         });
//       }
//     } catch (error: any) {
//       console.error("Error fetching candles:", error);
//       setCandles([]);
//     } finally {
//       setIsLoadingChart(false);
//     }
//   };

//   const checkWatchlist = async () => {
//     try {
//       const data = await watchlist.getAll();
//       const exists = data.some((item: any) => item.ticker === ticker);
//       setIsInWatchlist(exists);
//     } catch (error) {
//       console.error("Error checking watchlist:", error);
//     }
//   };

//   const handleToggleWatchlist = async () => {
//     try {
//       setIsAddingToWatchlist(true);
//       if (isInWatchlist) {
//         await watchlist.remove(ticker);
//         setIsInWatchlist(false);
//         toast({
//           title: "Removed from watchlist",
//           description: `₹{ticker} has been removed from your watchlist`,
//         });
//       } else {
//         await watchlist.add(ticker);
//         setIsInWatchlist(true);
//         toast({
//           title: "Added to watchlist",
//           description: `₹{ticker} has been added to your watchlist`,
//         });
//       }
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Could not update watchlist",
//         variant: "destructive",
//       });
//     } finally {
//       setIsAddingToWatchlist(false);
//     }
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//     }).format(price);
//   };

//   const formatLargeNumber = (num: number) => {
//     if (num >= 1e12) return `₹₹{(num / 1e12).toFixed(2)}T`;
//     if (num >= 1e9) return `₹₹{(num / 1e9).toFixed(2)}B`;
//     if (num >= 1e6) return `₹₹{(num / 1e6).toFixed(2)}M`;
//     return `₹₹{num}`;
//   };

//   const formatVolume = (volume: number) => {
//     if (volume >= 1e9) return `₹{(volume / 1e9).toFixed(2)}B`;
//     if (volume >= 1e6) return `₹{(volume / 1e6).toFixed(2)}M`;
//     if (volume >= 1e3) return `₹{(volume / 1e3).toFixed(2)}K`;
//     return volume.toString();
//   };

//   if (!ticker) {
//     return (
//       <AppLayout>
//         <div className="text-center py-12">
//           <p className="text-muted-foreground mb-4">No stock ticker provided</p>
//           <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
//         </div>
//       </AppLayout>
//     );
//   }

//   return (
//     <AppLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex items-center justify-between"
//         >
//           <div className="flex items-center gap-4">
//             <Button variant="ghost" onClick={() => navigate(-1)}>
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back
//             </Button>
//             <div>
//               <h1 className="text-2xl font-bold text-foreground">{ticker}</h1>
//               <p className="text-muted-foreground">{quote?.name || "Loading..."}</p>
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <Button
//               variant={isInWatchlist ? "outline" : "default"}
//               onClick={handleToggleWatchlist}
//               disabled={isAddingToWatchlist}
//               className={isInWatchlist ? "" : "gradient-primary text-primary-foreground"}
//             >
//               {isAddingToWatchlist ? (
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//               ) : (
//                 <Star
//                   className={`h-4 w-4 mr-2 ₹{isInWatchlist ? "fill-current" : ""}`}
//                 />
//               )}
//               {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
//             </Button>
//             <Link to={`/insights?stock=₹{ticker}`}>
//               <Button className="gradient-primary text-primary-foreground">
//                 <Brain className="h-4 w-4 mr-2" />
//                 AI Analysis
//               </Button>
//             </Link>
//           </div>
//         </motion.div>

//         {isLoading ? (
//           <div className="flex items-center justify-center py-12">
//             <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//           </div>
//         ) : !quote ? (
//           <div className="text-center py-12">
//             <p className="text-muted-foreground">Stock data not available</p>
//           </div>
//         ) : (
//           <>
//             {/* Price Card */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="bg-card rounded-xl p-6 shadow-card border border-border"
//             >
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-1">Current Price</p>
//                   <p className="text-4xl font-bold text-foreground">
//                     {formatPrice(quote.c)}
//                   </p>
//                   <div className="flex items-center gap-2 mt-2">
//                     <span
//                       className={`flex items-center gap-1 text-lg font-semibold ₹{
//                         quote.dp >= 0 ? "text-success" : "text-destructive"
//                       }`}
//                     >
//                       {quote.dp >= 0 ? (
//                         <TrendingUp className="h-5 w-5" />
//                       ) : (
//                         <TrendingDown className="h-5 w-5" />
//                       )}
//                       {quote.dp >= 0 ? "+" : ""}
//                       {quote.d.toFixed(2)} ({quote.dp.toFixed(2)}%)
//                     </span>
//                     <span className="text-sm text-muted-foreground">Today</span>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <div>
//                     <p className="text-xs text-muted-foreground mb-1">Open</p>
//                     <p className="font-semibold text-foreground">{formatPrice(quote.o)}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted-foreground mb-1">High</p>
//                     <p className="font-semibold text-foreground">{formatPrice(quote.h)}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted-foreground mb-1">Low</p>
//                     <p className="font-semibold text-foreground">{formatPrice(quote.l)}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-muted-foreground mb-1">Prev Close</p>
//                     <p className="font-semibold text-foreground">{formatPrice(quote.pc)}</p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Chart */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="bg-card rounded-xl p-6 shadow-card border border-border"
//             >
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-lg font-semibold text-foreground">Price Chart</h2>
//                 <div className="flex gap-2">
//                   {(["1D", "1W", "1M", "3M", "1Y"] as const).map((range) => (
//                     <Button
//                       key={range}
//                       variant={timeRange === range ? "default" : "outline"}
//                       size="sm"
//                       onClick={() => setTimeRange(range)}
//                       className={timeRange === range ? "gradient-primary text-primary-foreground" : ""}
//                     >
//                       {range}
//                     </Button>
//                   ))}
//                 </div>
//               </div>

//               {isLoadingChart ? (
//                 <div className="flex items-center justify-center h-64">
//                   <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//                 </div>
//               ) : candles.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-64 text-center px-4">
//                   <BarChart3 className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
//                   <h3 className="text-lg font-semibold text-foreground mb-2">
//                     Historical Chart Data Not Available
//                   </h3>
//                   <p className="text-muted-foreground max-w-md">
//                     Historical price charts require a premium API subscription. The free tier provides
//                     real-time quotes and AI analysis. Current price and all stock data are available above.
//                   </p>
//                   <p className="text-sm text-muted-foreground mt-3">
//                     <strong>Finnhub Premium</strong> or <strong>Alpha Vantage</strong> API keys support historical data
//                   </p>
//                 </div>
//               ) : (
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={candles}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                     <XAxis
//                       dataKey="time"
//                       stroke="#9CA3AF"
//                       style={{ fontSize: "12px" }}
//                     />
//                     <YAxis
//                       stroke="#9CA3AF"
//                       style={{ fontSize: "12px" }}
//                       domain={["auto", "auto"]}
//                     />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: "#1F2937",
//                         border: "1px solid #374151",
//                         borderRadius: "8px",
//                         color: "#F9FAFB",
//                       }}
//                       formatter={(value: any) => [formatPrice(value), "Price"]}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="price"
//                       stroke="#3B82F6"
//                       strokeWidth={2}
//                       dot={false}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               )}
//             </motion.div>

//             {/* Stats */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className="grid grid-cols-1 md:grid-cols-3 gap-4"
//             >
//               <div className="bg-card rounded-xl p-6 shadow-card border border-border">
//                 <div className="flex items-center gap-3 mb-2">
//                   <DollarSign className="h-5 w-5 text-accent" />
//                   <p className="text-sm text-muted-foreground">Market Cap</p>
//                 </div>
//                 <p className="text-2xl font-bold text-foreground">
//                   {quote.marketCapitalization
//                     ? formatLargeNumber(quote.marketCapitalization * 1e6)
//                     : "N/A"}
//                 </p>
//               </div>

//               <div className="bg-card rounded-xl p-6 shadow-card border border-border">
//                 <div className="flex items-center gap-3 mb-2">
//                   <BarChart3 className="h-5 w-5 text-warning" />
//                   <p className="text-sm text-muted-foreground">Volume</p>
//                 </div>
//                 <p className="text-2xl font-bold text-foreground">
//                   {quote.volume ? formatVolume(quote.volume) : "N/A"}
//                 </p>
//               </div>

//               <div className="bg-card rounded-xl p-6 shadow-card border border-border">
//                 <div className="flex items-center gap-3 mb-2">
//                   <Activity className="h-5 w-5 text-success" />
//                   <p className="text-sm text-muted-foreground">52 Week Range</p>
//                 </div>
//                 <p className="text-lg font-bold text-foreground">
//                   {quote["52WeekLow"] && quote["52WeekHigh"]
//                     ? `₹{formatPrice(quote["52WeekLow"])} - ₹{formatPrice(quote["52WeekHigh"])}`
//                     : "N/A"}
//                 </p>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </div>
//     </AppLayout>
//   );
// }

import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Brain,
  Star,
  Loader2,
  Calendar,
  DollarSign,
  BarChart3,
  Activity,
} from "lucide-react";
import { stocks, watchlist } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function StockDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ticker = searchParams.get("ticker")?.toUpperCase() || "";
  const { toast } = useToast();

  const [quote, setQuote] = useState<any>(null);
  const [candles, setCandles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [timeRange, setTimeRange] = useState<"1D" | "1W" | "1M" | "3M" | "1Y">("1M");
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false);

  useEffect(() => {
    if (ticker) {
      fetchStockData();
      checkWatchlist();
    }
  }, [ticker]);

  useEffect(() => {
    if (ticker) {
      fetchCandles();
    }
  }, [ticker, timeRange]);

  const fetchStockData = async () => {
    try {
      setIsLoading(true);
      const data = await stocks.getQuote(ticker);
      setQuote(data);
    } catch (error: any) {
      toast({
        title: "Error loading stock data",
        description: error.message || "Could not load stock information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCandles = async () => {
    try {
      setIsLoadingChart(true);

      const now = Math.floor(Date.now() / 1000);
      let from: number;
      let resolution: "1" | "5" | "15" | "30" | "60" | "D" | "W" | "M" = "D";

      switch (timeRange) {
        case "1D":
          from = now - (24 * 60 * 60);
          resolution = "5";
          break;
        case "1W":
          from = now - (7 * 24 * 60 * 60);
          resolution = "30";
          break;
        case "1M":
          from = now - (30 * 24 * 60 * 60);
          resolution = "D";
          break;
        case "3M":
          from = now - (90 * 24 * 60 * 60);
          resolution = "D";
          break;
        case "1Y":
          from = now - (365 * 24 * 60 * 60);
          resolution = "W";
          break;
        default:
          from = now - (30 * 24 * 60 * 60);
          resolution = "D";
      }

      const data = await stocks.getCandles(ticker, resolution, from, now);

      if (data.s === "ok" && data.t && data.t.length > 0) {
        const chartData = data.t.map((timestamp: number, index: number) => ({
          time: new Date(timestamp * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          price: data.c[index],
          open: data.o[index],
          high: data.h[index],
          low: data.l[index],
          volume: data.v[index],
        }));
        setCandles(chartData);
      } else {
        setCandles([]);
        toast({
          title: "No chart data",
          description: "Chart data is not available for this stock",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error fetching candles:", error);
      setCandles([]);
    } finally {
      setIsLoadingChart(false);
    }
  };

  const checkWatchlist = async () => {
    try {
      const data = await watchlist.getAll();
      const exists = data.some((item: any) => item.ticker === ticker);
      setIsInWatchlist(exists);
    } catch (error) {
      console.error("Error checking watchlist:", error);
    }
  };

  const handleToggleWatchlist = async () => {
    try {
      setIsAddingToWatchlist(true);
      if (isInWatchlist) {
        await watchlist.remove(ticker);
        setIsInWatchlist(false);
        toast({
          title: "Removed from watchlist",
          description: `${ticker} has been removed from your watchlist`,
        });
      } else {
        await watchlist.add(ticker);
        setIsInWatchlist(true);
        toast({
          title: "Added to watchlist",
          description: `${ticker} has been added to your watchlist`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Could not update watchlist",
        variant: "destructive",
      });
    } finally {
      setIsAddingToWatchlist(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `₹${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `₹${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `₹${(num / 1e6).toFixed(2)}M`;
    return `₹${num}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
    return volume.toString();
  };

  if (!ticker) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No stock ticker provided</p>
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{ticker}</h1>
              <p className="text-muted-foreground">{quote?.name || "Loading..."}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isInWatchlist ? "outline" : "default"}
              onClick={handleToggleWatchlist}
              disabled={isAddingToWatchlist}
              className={isInWatchlist ? "" : "gradient-primary text-primary-foreground"}
            >
              {isAddingToWatchlist ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Star
                  className={`h-4 w-4 mr-2 ${isInWatchlist ? "fill-current" : ""}`}
                />
              )}
              {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
            </Button>
            <Link to={`/insights?stock=${ticker}`}>
              <Button className="gradient-primary text-primary-foreground">
                <Brain className="h-4 w-4 mr-2" />
                AI Analysis
              </Button>
            </Link>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !quote ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Stock data not available</p>
          </div>
        ) : (
          <>
            {/* Price Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl p-6 shadow-card border border-border"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                  <p className="text-4xl font-bold text-foreground">
                    {formatPrice(quote.c)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`flex items-center gap-1 text-lg font-semibold ${
                        quote.dp >= 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {quote.dp >= 0 ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                      {quote.dp >= 0 ? "+" : ""}
                      {quote.d.toFixed(2)} ({quote.dp.toFixed(2)}%)
                    </span>
                    <span className="text-sm text-muted-foreground">Today</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Open</p>
                    <p className="font-semibold text-foreground">{formatPrice(quote.o)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">High</p>
                    <p className="font-semibold text-foreground">{formatPrice(quote.h)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Low</p>
                    <p className="font-semibold text-foreground">{formatPrice(quote.l)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Prev Close</p>
                    <p className="font-semibold text-foreground">{formatPrice(quote.pc)}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-6 shadow-card border border-border"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Price Chart</h2>
                <div className="flex gap-2">
                  {(["1D", "1W", "1M", "3M", "1Y"] as const).map((range) => (
                    <Button
                      key={range}
                      variant={timeRange === range ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTimeRange(range)}
                      className={timeRange === range ? "gradient-primary text-primary-foreground" : ""}
                    >
                      {range}
                    </Button>
                  ))}
                </div>
              </div>

              {isLoadingChart ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : candles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Historical Chart Data Not Available
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Historical price charts require a premium API subscription. The free tier provides
                    real-time quotes and AI analysis. Current price and all stock data are available above.
                  </p>
                  <p className="text-sm text-muted-foreground mt-3">
                    <strong>Finnhub Premium</strong> or <strong>Alpha Vantage</strong> API keys support historical data
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={candles}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="time"
                      stroke="#9CA3AF"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      style={{ fontSize: "12px" }}
                      domain={["auto", "auto"]}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F9FAFB",
                      }}
                      formatter={(value: any) => [formatPrice(value), "Price"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-5 w-5 text-accent" />
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {quote.marketCapitalization
                    ? formatLargeNumber(quote.marketCapitalization * 1e6)
                    : "N/A"}
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="h-5 w-5 text-warning" />
                  <p className="text-sm text-muted-foreground">Volume</p>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {quote.volume ? formatVolume(quote.volume) : "N/A"}
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="h-5 w-5 text-success" />
                  <p className="text-sm text-muted-foreground">52 Week Range</p>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {quote["52WeekLow"] && quote["52WeekHigh"]
                    ? `${formatPrice(quote["52WeekLow"])} - ${formatPrice(quote["52WeekHigh"])}`
                    : "N/A"}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </AppLayout>
  );
}