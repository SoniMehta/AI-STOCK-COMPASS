// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { AppLayout } from "@/components/layout/AppLayout";
// import { TrendIndicator } from "@/components/ui/TrendIndicator";
// import { ConfidenceBar } from "@/components/ui/ConfidenceBar";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   History as HistoryIcon,
//   Search,
//   ChevronDown,
//   ChevronUp,
//   Clock,
//   Calendar,
//   Filter,
//   Brain,
//   Activity,
//   Newspaper,
//   Shield,
//   Loader2,
// } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { history as historyAPI } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";

// interface AnalysisHistory {
//   id: number;
//   ticker: string;
//   analysis_type: string;
//   recommendation: string;
//   confidence: number;
//   market_trend: string;
//   sentiment: string;
//   risk_level: string;
//   summary: string;
//   full_analysis: string;
//   created_at: string;
// }

// export default function History() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [typeFilter, setTypeFilter] = useState("all");
//   const [expandedId, setExpandedId] = useState<number | null>(null);
//   const [historyData, setHistoryData] = useState<AnalysisHistory[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     try {
//       setIsLoading(true);
//       const data = await historyAPI.getAll();
//       setHistoryData(data);
//     } catch (error: any) {
//       console.error("Error fetching history:", error);
//       toast({
//         title: "Error loading history",
//         description: error.message || "Could not load your analysis history",
//         variant: "destructive",
//       });
//       setHistoryData([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filteredHistory = historyData.filter((item) => {
//     const matchesSearch = item.ticker.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesType =
//       typeFilter === "all" ||
//       (typeFilter === "full" && item.analysis_type === "full") ||
//       (typeFilter === "sentiment" && item.analysis_type === "sentiment") ||
//       (typeFilter === "risk" && item.analysis_type === "risk") ||
//       (typeFilter === "market" && item.analysis_type === "market");
//     return matchesSearch && matchesType;
//   });

//   const getRecommendationColor = (rec: string) => {
//     if (rec === "BUY" || rec === "STRONG BUY") return "text-success bg-success/10";
//     if (rec === "SELL" || rec === "STRONG SELL") return "text-destructive bg-destructive/10";
//     return "text-warning bg-warning/10";
//   };

//   const getTrendFromRecommendation = (recommendation: string): "bullish" | "bearish" | "neutral" => {
//     if (recommendation === "BUY" || recommendation === "STRONG BUY") return "bullish";
//     if (recommendation === "SELL" || recommendation === "STRONG SELL") return "bearish";
//     return "neutral";
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getAnalysisType = (type: string) => {
//     const types: { [key: string]: string } = {
//       full: "Full Analysis",
//       market: "Market Analysis",
//       sentiment: "Sentiment Analysis",
//       risk: "Risk Assessment",
//     };
//     return types[type] || type;
//   };

//   const parseFullAnalysis = (fullAnalysisString: string) => {
//     try {
//       return JSON.parse(fullAnalysisString);
//     } catch {
//       return null;
//     }
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
//               <HistoryIcon className="h-6 w-6 text-muted-foreground" />
//               Analysis History
//             </h1>
//             <p className="text-muted-foreground">
//               {isLoading ? "Loading..." : `₹{historyData.length} analysis₹{historyData.length !== 1 ? "es" : ""} recorded`}
//             </p>
//           </div>
//         </motion.div>

//         {/* Filters */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="flex flex-col sm:flex-row gap-4"
//         >
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search by stock ticker..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <Filter className="h-4 w-4 text-muted-foreground" />
//             <Select value={typeFilter} onValueChange={setTypeFilter}>
//               <SelectTrigger className="w-44 bg-card">
//                 <SelectValue placeholder="Filter by type" />
//               </SelectTrigger>
//               <SelectContent className="bg-card border-border">
//                 <SelectItem value="all">All Types</SelectItem>
//                 <SelectItem value="full">Full Analysis</SelectItem>
//                 <SelectItem value="sentiment">Sentiment Only</SelectItem>
//                 <SelectItem value="risk">Risk Assessment</SelectItem>
//                 <SelectItem value="market">Market Analysis</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </motion.div>

//         {/* History List */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.2 }}
//           className="space-y-4"
//         >
//           {isLoading ? (
//             <div className="flex items-center justify-center py-12">
//               <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//             </div>
//           ) : filteredHistory.length === 0 ? (
//             <div className="text-center py-12 bg-card rounded-xl border border-border">
//               <HistoryIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
//               <h3 className="text-lg font-semibold text-foreground mb-2">
//                 {historyData.length === 0 ? "No analysis history yet" : "No matching analyses found"}
//               </h3>
//               <p className="text-muted-foreground mb-6">
//                 {historyData.length === 0
//                   ? "Start analyzing stocks to build your analysis history"
//                   : "Try adjusting your search or filters"}
//               </p>
//               {historyData.length === 0 && (
//                 <Button className="gradient-primary text-primary-foreground" onClick={() => (window.location.href = "/insights")}>
//                   <Brain className="h-4 w-4 mr-2" />
//                   Analyze a Stock
//                 </Button>
//               )}
//             </div>
//           ) : (
//             filteredHistory.map((item, index) => {
//               const fullAnalysis = parseFullAnalysis(item.full_analysis);
//               const trend = getTrendFromRecommendation(item.recommendation);

//               return (
//                 <motion.div
//                   key={item.id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.05 }}
//                   className="bg-card rounded-xl shadow-card border border-border overflow-hidden"
//                 >
//                   <button
//                     onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
//                     className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center font-bold text-foreground">
//                         {item.ticker.slice(0, 2)}
//                       </div>
//                       <div className="text-left">
//                         <div className="flex items-center gap-3">
//                           <span className="font-semibold text-foreground">{item.ticker}</span>
//                           <TrendIndicator trend={trend} size="sm" />
//                         </div>
//                         <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
//                           <span className="flex items-center gap-1">
//                             <Calendar className="h-3 w-3" />
//                             {formatDate(item.created_at)}
//                           </span>
//                           <span className="px-2 py-0.5 rounded bg-secondary text-xs">
//                             {getAnalysisType(item.analysis_type)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-sm font-semibold ₹{getRecommendationColor(
//                           item.recommendation
//                         )}`}
//                       >
//                         {item.recommendation}
//                       </span>
//                       {expandedId === item.id ? (
//                         <ChevronUp className="h-5 w-5 text-muted-foreground" />
//                       ) : (
//                         <ChevronDown className="h-5 w-5 text-muted-foreground" />
//                       )}
//                     </div>
//                   </button>

//                   <AnimatePresence>
//                     {expandedId === item.id && (
//                       <motion.div
//                         initial={{ height: 0, opacity: 0 }}
//                         animate={{ height: "auto", opacity: 1 }}
//                         exit={{ height: 0, opacity: 0 }}
//                         className="border-t border-border"
//                       >
//                         <div className="p-4 space-y-4">
//                           <p className="text-muted-foreground">{item.summary}</p>

//                           {item.confidence > 0 && (
//                             <ConfidenceBar value={item.confidence} label="Overall Confidence" size="md" />
//                           )}

//                           {fullAnalysis && (
//                             <div className="grid md:grid-cols-3 gap-4">
//                               {fullAnalysis.market && (
//                                 <div className="bg-secondary/50 rounded-lg p-3">
//                                   <div className="flex items-center gap-2 mb-2">
//                                     <Activity className="h-4 w-4 text-navy-500" />
//                                     <span className="text-sm font-medium text-foreground">Market Agent</span>
//                                   </div>
//                                   <p className="text-sm text-muted-foreground">
//                                     Trend: {fullAnalysis.market.trend || item.market_trend || "N/A"}
//                                   </p>
//                                   {fullAnalysis.market.confidence > 0 && (
//                                     <ConfidenceBar value={fullAnalysis.market.confidence} size="sm" className="mt-2" />
//                                   )}
//                                 </div>
//                               )}

//                               {fullAnalysis.sentiment && (
//                                 <div className="bg-secondary/50 rounded-lg p-3">
//                                   <div className="flex items-center gap-2 mb-2">
//                                     <Newspaper className="h-4 w-4 text-warning" />
//                                     <span className="text-sm font-medium text-foreground">Sentiment Agent</span>
//                                   </div>
//                                   <p className="text-sm text-muted-foreground">
//                                     Overall: {fullAnalysis.sentiment.overall || item.sentiment || "N/A"}
//                                   </p>
//                                   {fullAnalysis.sentiment.confidence > 0 && (
//                                     <ConfidenceBar value={fullAnalysis.sentiment.confidence} size="sm" className="mt-2" />
//                                   )}
//                                 </div>
//                               )}

//                               {fullAnalysis.risk && (
//                                 <div className="bg-secondary/50 rounded-lg p-3">
//                                   <div className="flex items-center gap-2 mb-2">
//                                     <Shield className="h-4 w-4 text-destructive" />
//                                     <span className="text-sm font-medium text-foreground">Risk Agent</span>
//                                   </div>
//                                   <p className="text-sm text-muted-foreground">
//                                     Level: {fullAnalysis.risk.level || item.risk_level || "N/A"}
//                                   </p>
//                                   {fullAnalysis.risk.confidence > 0 && (
//                                     <ConfidenceBar value={fullAnalysis.risk.confidence} size="sm" className="mt-2" />
//                                   )}
//                                 </div>
//                               )}
//                             </div>
//                           )}

//                           {!fullAnalysis && (
//                             <div className="grid md:grid-cols-3 gap-4">
//                               {item.market_trend && (
//                                 <div className="bg-secondary/50 rounded-lg p-3">
//                                   <div className="flex items-center gap-2 mb-2">
//                                     <Activity className="h-4 w-4 text-navy-500" />
//                                     <span className="text-sm font-medium text-foreground">Market</span>
//                                   </div>
//                                   <p className="text-sm text-muted-foreground">Trend: {item.market_trend}</p>
//                                 </div>
//                               )}

//                               {item.sentiment && (
//                                 <div className="bg-secondary/50 rounded-lg p-3">
//                                   <div className="flex items-center gap-2 mb-2">
//                                     <Newspaper className="h-4 w-4 text-warning" />
//                                     <span className="text-sm font-medium text-foreground">Sentiment</span>
//                                   </div>
//                                   <p className="text-sm text-muted-foreground">Overall: {item.sentiment}</p>
//                                 </div>
//                               )}

//                               {item.risk_level && (
//                                 <div className="bg-secondary/50 rounded-lg p-3">
//                                   <div className="flex items-center gap-2 mb-2">
//                                     <Shield className="h-4 w-4 text-destructive" />
//                                     <span className="text-sm font-medium text-foreground">Risk</span>
//                                   </div>
//                                   <p className="text-sm text-muted-foreground">Level: {item.risk_level}</p>
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </motion.div>
//               );
//             })
//           )}
//         </motion.div>
//       </div>
//     </AppLayout>
//   );
// }


import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { TrendIndicator } from "@/components/ui/TrendIndicator";
import { ConfidenceBar } from "@/components/ui/ConfidenceBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  History as HistoryIcon,
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  Filter,
  Brain,
  Activity,
  Newspaper,
  Shield,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { history as historyAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AnalysisHistory {
  id: number;
  ticker: string;
  analysis_type: string;
  recommendation: string;
  confidence: number;
  market_trend: string;
  sentiment: string;
  risk_level: string;
  summary: string;
  full_analysis: string;
  created_at: string;
}

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [historyData, setHistoryData] = useState<AnalysisHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const data = await historyAPI.getAll();
      setHistoryData(data);
    } catch (error: any) {
      console.error("Error fetching history:", error);
      toast({
        title: "Error loading history",
        description: error.message || "Could not load your analysis history",
        variant: "destructive",
      });
      setHistoryData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHistory = historyData.filter((item) => {
    const matchesSearch = item.ticker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "full" && item.analysis_type === "full") ||
      (typeFilter === "sentiment" && item.analysis_type === "sentiment") ||
      (typeFilter === "risk" && item.analysis_type === "risk") ||
      (typeFilter === "market" && item.analysis_type === "market");
    return matchesSearch && matchesType;
  });

  const getRecommendationColor = (rec: string) => {
    if (rec === "BUY" || rec === "STRONG BUY") return "text-success bg-success/10";
    if (rec === "SELL" || rec === "STRONG SELL") return "text-destructive bg-destructive/10";
    return "text-warning bg-warning/10";
  };

  const getTrendFromRecommendation = (recommendation: string): "bullish" | "bearish" | "neutral" => {
    if (recommendation === "BUY" || recommendation === "STRONG BUY") return "bullish";
    if (recommendation === "SELL" || recommendation === "STRONG SELL") return "bearish";
    return "neutral";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAnalysisType = (type: string) => {
    const types: { [key: string]: string } = {
      full: "Full Analysis",
      market: "Market Analysis",
      sentiment: "Sentiment Analysis",
      risk: "Risk Assessment",
    };
    return types[type] || type;
  };

  const parseFullAnalysis = (fullAnalysisString: string) => {
    try {
      return JSON.parse(fullAnalysisString);
    } catch {
      return null;
    }
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
              <HistoryIcon className="h-6 w-6 text-muted-foreground" />
              Analysis History
            </h1>
            <p className="text-muted-foreground">
              {isLoading ? "Loading..." : `${historyData.length} analysis${historyData.length !== 1 ? "es" : ""} recorded`}
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by stock ticker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-44 bg-card">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full">Full Analysis</SelectItem>
                <SelectItem value="sentiment">Sentiment Only</SelectItem>
                <SelectItem value="risk">Risk Assessment</SelectItem>
                <SelectItem value="market">Market Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* History List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <HistoryIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {historyData.length === 0 ? "No analysis history yet" : "No matching analyses found"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {historyData.length === 0
                  ? "Start analyzing stocks to build your analysis history"
                  : "Try adjusting your search or filters"}
              </p>
              {historyData.length === 0 && (
                <Button className="gradient-primary text-primary-foreground" onClick={() => (window.location.href = "/insights")}>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze a Stock
                </Button>
              )}
            </div>
          ) : (
            filteredHistory.map((item, index) => {
              const fullAnalysis = parseFullAnalysis(item.full_analysis);
              const trend = getTrendFromRecommendation(item.recommendation);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-xl shadow-card border border-border overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center font-bold text-foreground">
                        {item.ticker.slice(0, 2)}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-foreground">{item.ticker}</span>
                          <TrendIndicator trend={trend} size="sm" />
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.created_at)}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-secondary text-xs">
                            {getAnalysisType(item.analysis_type)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getRecommendationColor(
                          item.recommendation
                        )}`}
                      >
                        {item.recommendation}
                      </span>
                      {expandedId === item.id ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedId === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border"
                      >
                        <div className="p-4 space-y-4">
                          <p className="text-muted-foreground">{item.summary}</p>

                          {item.confidence > 0 && (
                            <ConfidenceBar value={item.confidence} label="Overall Confidence" size="md" />
                          )}

                          {fullAnalysis && (
                            <div className="grid md:grid-cols-3 gap-4">
                              {fullAnalysis.market && (
                                <div className="bg-secondary/50 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Activity className="h-4 w-4 text-navy-500" />
                                    <span className="text-sm font-medium text-foreground">Market Agent</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Trend: {fullAnalysis.market.trend || item.market_trend || "N/A"}
                                  </p>
                                  {fullAnalysis.market.confidence > 0 && (
                                    <ConfidenceBar value={fullAnalysis.market.confidence} size="sm" className="mt-2" />
                                  )}
                                </div>
                              )}

                              {fullAnalysis.sentiment && (
                                <div className="bg-secondary/50 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Newspaper className="h-4 w-4 text-warning" />
                                    <span className="text-sm font-medium text-foreground">Sentiment Agent</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Overall: {fullAnalysis.sentiment.overall || item.sentiment || "N/A"}
                                  </p>
                                  {fullAnalysis.sentiment.confidence > 0 && (
                                    <ConfidenceBar value={fullAnalysis.sentiment.confidence} size="sm" className="mt-2" />
                                  )}
                                </div>
                              )}

                              {fullAnalysis.risk && (
                                <div className="bg-secondary/50 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Shield className="h-4 w-4 text-destructive" />
                                    <span className="text-sm font-medium text-foreground">Risk Agent</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Level: {fullAnalysis.risk.level || item.risk_level || "N/A"}
                                  </p>
                                  {fullAnalysis.risk.confidence > 0 && (
                                    <ConfidenceBar value={fullAnalysis.risk.confidence} size="sm" className="mt-2" />
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {!fullAnalysis && (
                            <div className="grid md:grid-cols-3 gap-4">
                              {item.market_trend && (
                                <div className="bg-secondary/50 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Activity className="h-4 w-4 text-navy-500" />
                                    <span className="text-sm font-medium text-foreground">Market</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">Trend: {item.market_trend}</p>
                                </div>
                              )}

                              {item.sentiment && (
                                <div className="bg-secondary/50 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Newspaper className="h-4 w-4 text-warning" />
                                    <span className="text-sm font-medium text-foreground">Sentiment</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">Overall: {item.sentiment}</p>
                                </div>
                              )}

                              {item.risk_level && (
                                <div className="bg-secondary/50 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Shield className="h-4 w-4 text-destructive" />
                                    <span className="text-sm font-medium text-foreground">Risk</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">Level: {item.risk_level}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}