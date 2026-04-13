// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { AppLayout } from "@/components/layout/AppLayout";
// import { SentimentBadge } from "@/components/ui/SentimentBadge";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Search,
//   ExternalLink,
//   Clock,
//   Filter,
//   RefreshCw,
//   Loader2,
//   Newspaper,
// } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { news as newsAPI } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";

// interface NewsArticle {
//   title: string;
//   description: string;
//   source: string;
//   url: string;
//   published_at: string;
//   image_url?: string;
//   sentiment?: "positive" | "neutral" | "negative";
// }

// export default function News() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sentimentFilter, setSentimentFilter] = useState("all");
//   const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchNews();
//   }, []);

//   const fetchNews = async () => {
//     try {
//       setIsLoading(true);
//       const data = await newsAPI.getMarketNews(30);

//       // Add basic sentiment analysis based on keywords
//       const articlesWithSentiment = data.map((article: NewsArticle) => ({
//         ...article,
//         sentiment: analyzeSentiment(article.title + " " + (article.description || "")),
//       }));

//       setNewsArticles(articlesWithSentiment);
//     } catch (error: any) {
//       console.error("Error fetching news:", error);

//       // Check if it's a News API key issue
//       if (error.message && error.message.includes("News API")) {
//         toast({
//           title: "News API Key Issue",
//           description: "The News API key may not be working. Please check the backend .env configuration.",
//           variant: "destructive",
//         });
//       } else {
//         toast({
//           title: "Error loading news",
//           description: error.message || "Could not load news articles",
//           variant: "destructive",
//         });
//       }

//       setNewsArticles([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const analyzeSentiment = (text: string): "positive" | "neutral" | "negative" => {
//     const lowerText = text.toLowerCase();
//     const positiveWords = [
//       "surge", "soar", "rally", "gain", "rise", "bull", "record", "high",
//       "growth", "profit", "success", "beat", "exceed", "strong", "breakthrough",
//       "up", "positive", "boom", "jump", "climb"
//     ];
//     const negativeWords = [
//       "fall", "drop", "plunge", "crash", "bear", "loss", "decline", "down",
//       "weak", "miss", "fail", "concern", "worry", "risk", "threat", "sell",
//       "negative", "slump", "tumble"
//     ];

//     let positiveCount = 0;
//     let negativeCount = 0;

//     positiveWords.forEach(word => {
//       if (lowerText.includes(word)) positiveCount++;
//     });

//     negativeWords.forEach(word => {
//       if (lowerText.includes(word)) negativeCount++;
//     });

//     if (positiveCount > negativeCount) return "positive";
//     if (negativeCount > positiveCount) return "negative";
//     return "neutral";
//   };

//   const filteredArticles = newsArticles.filter((article) => {
//     const matchesSearch =
//       article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (article.description && article.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
//       article.source.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesSentiment =
//       sentimentFilter === "all" || article.sentiment === sentimentFilter;
//     return matchesSearch && matchesSentiment;
//   });

//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     await fetchNews();
//     setIsRefreshing(false);
//     toast({
//       title: "News refreshed",
//       description: "Latest financial news has been loaded.",
//     });
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
//       <div className="space-y-6">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
//         >
//           <div>
//             <h1 className="text-2xl font-bold text-foreground">Financial News</h1>
//             <p className="text-muted-foreground">
//               {isLoading
//                 ? "Loading..."
//                 : `₹{newsArticles.length} article₹{newsArticles.length !== 1 ? "s" : ""} • Real-time market updates`}
//             </p>
//           </div>
//           <Button
//             variant="outline"
//             onClick={handleRefresh}
//             disabled={isRefreshing}
//             className="gap-2"
//           >
//             <RefreshCw className={`h-4 w-4 ₹{isRefreshing ? "animate-spin" : ""}`} />
//             Refresh
//           </Button>
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
//               placeholder="Search by headline, source, or content..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <Filter className="h-4 w-4 text-muted-foreground" />
//             <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
//               <SelectTrigger className="w-40 bg-card">
//                 <SelectValue placeholder="Filter by sentiment" />
//               </SelectTrigger>
//               <SelectContent className="bg-card border-border">
//                 <SelectItem value="all">All Sentiment</SelectItem>
//                 <SelectItem value="positive">Positive</SelectItem>
//                 <SelectItem value="neutral">Neutral</SelectItem>
//                 <SelectItem value="negative">Negative</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </motion.div>

//         {/* News List */}
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
//           ) : newsArticles.length === 0 ? (
//             <div className="text-center py-12 bg-card rounded-xl border border-border">
//               <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
//               <h3 className="text-lg font-semibold text-foreground mb-2">No news available</h3>
//               <p className="text-muted-foreground mb-6">
//                 Unable to fetch news articles. This may be due to API configuration.
//               </p>
//               <Button onClick={handleRefresh} variant="outline">
//                 <RefreshCw className="h-4 w-4 mr-2" />
//                 Try Again
//               </Button>
//             </div>
//           ) : filteredArticles.length === 0 ? (
//             <div className="text-center py-12 bg-card rounded-xl border border-border">
//               <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
//               <p className="text-muted-foreground">No articles found matching your criteria.</p>
//             </div>
//           ) : (
//             filteredArticles.map((article, index) => (
//               <motion.article
//                 key={article.url + article.published_at}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 className="bg-card rounded-xl p-5 shadow-card border border-border hover:shadow-card-hover transition-all duration-300"
//               >
//                 <div className="flex flex-col md:flex-row md:items-start gap-4">
//                   <div className="flex-1 space-y-3">
//                     <div className="flex items-center gap-3 flex-wrap">
//                       {article.sentiment && (
//                         <SentimentBadge sentiment={article.sentiment} size="sm" />
//                       )}
//                     </div>

//                     <h2 className="text-lg font-semibold text-foreground leading-snug hover:text-accent transition-colors">
//                       {article.title}
//                     </h2>

//                     <p className="text-muted-foreground text-sm line-clamp-2">
//                       {article.description || "No description available"}
//                     </p>

//                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                       <span className="font-medium">{article.source}</span>
//                       <span className="flex items-center gap-1">
//                         <Clock className="h-3 w-3" />
//                         {formatDate(article.published_at)}
//                       </span>
//                     </div>
//                   </div>

//                   <a
//                     href={article.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <Button variant="ghost" size="sm" className="text-accent shrink-0">
//                       <ExternalLink className="h-4 w-4 mr-1" />
//                       Read
//                     </Button>
//                   </a>
//                 </div>
//               </motion.article>
//             ))
//           )}
//         </motion.div>
//       </div>
//     </AppLayout>
//   );
// }

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { SentimentBadge } from "@/components/ui/SentimentBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  ExternalLink,
  Clock,
  Filter,
  RefreshCw,
  Loader2,
  Newspaper,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { news as newsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface NewsArticle {
  title: string;
  description: string;
  source: string;
  url: string;
  published_at: string;
  image_url?: string;
  sentiment?: "positive" | "neutral" | "negative";
}

export default function News() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const data = await newsAPI.getMarketNews(30);

      // Add basic sentiment analysis based on keywords
      const articlesWithSentiment = data.map((article: NewsArticle) => ({
        ...article,
        sentiment: analyzeSentiment(article.title + " " + (article.description || "")),
      }));

      setNewsArticles(articlesWithSentiment);
    } catch (error: any) {
      console.error("Error fetching news:", error);

      // Check if it's a News API key issue
      if (error.message && error.message.includes("News API")) {
        toast({
          title: "News API Key Issue",
          description: "The News API key may not be working. Please check the backend .env configuration.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error loading news",
          description: error.message || "Could not load news articles",
          variant: "destructive",
        });
      }

      setNewsArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeSentiment = (text: string): "positive" | "neutral" | "negative" => {
    const lowerText = text.toLowerCase();
    const positiveWords = [
      "surge", "soar", "rally", "gain", "rise", "bull", "record", "high",
      "growth", "profit", "success", "beat", "exceed", "strong", "breakthrough",
      "up", "positive", "boom", "jump", "climb"
    ];
    const negativeWords = [
      "fall", "drop", "plunge", "crash", "bear", "loss", "decline", "down",
      "weak", "miss", "fail", "concern", "worry", "risk", "threat", "sell",
      "negative", "slump", "tumble"
    ];

    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveCount++;
    });

    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeCount++;
    });

    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  };

  const filteredArticles = newsArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.description && article.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      article.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSentiment =
      sentimentFilter === "all" || article.sentiment === sentimentFilter;
    return matchesSearch && matchesSentiment;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchNews();
    setIsRefreshing(false);
    toast({
      title: "News refreshed",
      description: "Latest financial news has been loaded.",
    });
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
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Financial News</h1>
            <p className="text-muted-foreground">
              {isLoading
                ? "Loading..."
                : `${newsArticles.length} article${newsArticles.length !== 1 ? "s" : ""} • Real-time market updates`}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
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
              placeholder="Search by headline, source, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
              <SelectTrigger className="w-40 bg-card">
                <SelectValue placeholder="Filter by sentiment" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Sentiment</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* News List */}
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
          ) : newsArticles.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No news available</h3>
              <p className="text-muted-foreground mb-6">
                Unable to fetch news articles. This may be due to API configuration.
              </p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground">No articles found matching your criteria.</p>
            </div>
          ) : (
            filteredArticles.map((article, index) => (
              <motion.article
                key={article.url + article.published_at}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl p-5 shadow-card border border-border hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      {article.sentiment && (
                        <SentimentBadge sentiment={article.sentiment} size="sm" />
                      )}
                    </div>

                    <h2 className="text-lg font-semibold text-foreground leading-snug hover:text-accent transition-colors">
                      {article.title}
                    </h2>

                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {article.description || "No description available"}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium">{article.source}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(article.published_at)}
                      </span>
                    </div>
                  </div>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="sm" className="text-accent shrink-0">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Read
                    </Button>
                  </a>
                </div>
              </motion.article>
            ))
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
