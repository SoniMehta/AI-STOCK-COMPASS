import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendIndicator } from "@/components/ui/TrendIndicator";
import { SentimentBadge } from "@/components/ui/SentimentBadge";
import { ConfidenceBar } from "@/components/ui/ConfidenceBar";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  Search,
  TrendingUp,
  Newspaper,
  Shield,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  Activity,
  Target,
  BarChart3,
} from "lucide-react";

interface AnalysisResult {
  market: {
    trend: "bullish" | "bearish" | "neutral";
    support: string;
    resistance: string;
    confidence: number;
    summary: string;
  };
  sentiment: {
    overall: "positive" | "negative" | "neutral";
    articlesAnalyzed: number;
    confidence: number;
    headlines: string[];
  };
  risk: {
    level: "low" | "medium" | "high";
    volatility: string;
    esgScore: string;
    confidence: number;
    factors: string[];
  };
  decision: {
    recommendation: string;
    summary: string;
    confidence: number;
    reasoning: string;
  };
}

const mockResult: AnalysisResult = {
  market: {
    trend: "bullish",
    support: "₹172.50",
    resistance: "₹185.00",
    confidence: 82,
    summary: "Strong upward momentum with consistent higher lows. RSI indicates healthy buying pressure without overbought conditions.",
  },
  sentiment: {
    overall: "positive",
    articlesAnalyzed: 47,
    confidence: 76,
    headlines: [
      "Apple Reports Record Q4 Earnings",
      "iPhone 16 Pre-orders Exceed Expectations",
      "Services Revenue Hits All-Time High",
    ],
  },
  risk: {
    level: "low",
    volatility: "12.3%",
    esgScore: "A+",
    confidence: 88,
    factors: [
      "Strong cash position (₹162B)",
      "Diversified revenue streams",
      "Low debt-to-equity ratio",
    ],
  },
  decision: {
    recommendation: "BUY",
    summary: "Apple presents a compelling investment opportunity with strong fundamentals, positive market sentiment, and manageable risk profile.",
    confidence: 79,
    reasoning: "The combination of bullish technical indicators, overwhelmingly positive news sentiment, and low risk profile suggests favorable conditions for investment. The company's strong earnings, growing services segment, and upcoming product launches support continued growth momentum.",
  },
};

export default function Insights() {
  const [searchParams] = useSearchParams();
  const initialStock = searchParams.get("stock") || "";
  
  const [stockTicker, setStockTicker] = useState(initialStock);
  const [analysisType, setAnalysisType] = useState("full");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("decision");

  const handleAnalyze = () => {
    if (!stockTicker.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult(mockResult);
    }, 3000);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-success bg-success/10";
      case "medium":
        return "text-warning bg-warning/10";
      case "high":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-secondary";
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Multi-Agent AI Analysis
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Stock Insights</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Get comprehensive AI-powered analysis combining market data, news sentiment, and risk assessment.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-6 shadow-card border border-border"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-2">
              <Label htmlFor="ticker">Stock Ticker</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="ticker"
                  placeholder="e.g., AAPL"
                  value={stockTicker}
                  onChange={(e) => setStockTicker(e.target.value.toUpperCase())}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="md:col-span-1 space-y-2">
              <Label>Analysis Type</Label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger className="h-11 bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="full">Full Decision Synthesis</SelectItem>
                  <SelectItem value="market">Market Analysis Only</SelectItem>
                  <SelectItem value="sentiment">News Sentiment Only</SelectItem>
                  <SelectItem value="risk">Risk Assessment Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-1 flex items-end">
              <Button
                onClick={handleAnalyze}
                disabled={!stockTicker.trim() || isAnalyzing}
                className="w-full h-11 gradient-primary text-primary-foreground font-medium"
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Analyze
                  </div>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  <span>AI agents are analyzing {stockTicker}...</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <SkeletonCard rows={4} />
                <SkeletonCard rows={4} />
                <SkeletonCard rows={4} />
                <SkeletonCard rows={4} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Decision Synthesis - Primary Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-xl shadow-card border-2 border-accent/20 overflow-hidden"
              >
                <button
                  onClick={() => toggleSection("decision")}
                  className="w-full p-6 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-accent/10">
                      <Sparkles className="h-6 w-6 text-accent" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-foreground">Decision Synthesis</h3>
                      <p className="text-sm text-muted-foreground">AI Recommendation for {stockTicker}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-4 py-2 rounded-full text-lg font-bold ₹{
                        result.decision.recommendation === "BUY"
                          ? "bg-success/10 text-success"
                          : result.decision.recommendation === "SELL"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {result.decision.recommendation}
                    </span>
                    {expandedSection === "decision" ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {expandedSection === "decision" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border"
                    >
                      <div className="p-6 space-y-4">
                        <p className="text-foreground text-lg leading-relaxed">
                          {result.decision.summary}
                        </p>
                        <ConfidenceBar
                          value={result.decision.confidence}
                          label="Overall Confidence"
                          size="lg"
                        />
                        <div className="bg-secondary/50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Info className="h-4 w-4 text-accent" />
                            <span className="font-medium text-foreground">Why this decision?</span>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {result.decision.reasoning}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Agent Cards Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Market Data Agent */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-xl shadow-card border border-border overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection("market")}
                    className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-navy-500/10">
                        <Activity className="h-5 w-5 text-navy-500" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-foreground">Market Analysis</h3>
                        <TrendIndicator trend={result.market.trend} size="sm" />
                      </div>
                    </div>
                    {expandedSection === "market" ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSection === "market" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border"
                      >
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-secondary/50 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground mb-1">Support</p>
                              <p className="font-semibold text-foreground">{result.market.support}</p>
                            </div>
                            <div className="bg-secondary/50 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground mb-1">Resistance</p>
                              <p className="font-semibold text-foreground">{result.market.resistance}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{result.market.summary}</p>
                          <ConfidenceBar value={result.market.confidence} label="Confidence" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Sentiment Agent */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card rounded-xl shadow-card border border-border overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection("sentiment")}
                    className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-warning/10">
                        <Newspaper className="h-5 w-5 text-warning" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-foreground">News Sentiment</h3>
                        <SentimentBadge sentiment={result.sentiment.overall} size="sm" />
                      </div>
                    </div>
                    {expandedSection === "sentiment" ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSection === "sentiment" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border"
                      >
                        <div className="p-4 space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Analyzed <span className="font-medium text-foreground">{result.sentiment.articlesAnalyzed}</span> articles
                          </p>
                          <div className="space-y-2">
                            {result.sentiment.headlines.map((headline, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{headline}</span>
                              </div>
                            ))}
                          </div>
                          <ConfidenceBar value={result.sentiment.confidence} label="Confidence" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Risk Agent */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-card rounded-xl shadow-card border border-border overflow-hidden md:col-span-2"
                >
                  <button
                    onClick={() => toggleSection("risk")}
                    className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-destructive/10">
                        <Shield className="h-5 w-5 text-destructive" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-foreground">Risk Assessment</h3>
                        <span className={`text-sm font-medium px-2 py-0.5 rounded-full ₹{getRiskColor(result.risk.level)}`}>
                          {result.risk.level.charAt(0).toUpperCase() + result.risk.level.slice(1)} Risk
                        </span>
                      </div>
                    </div>
                    {expandedSection === "risk" ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSection === "risk" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border"
                      >
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-secondary/50 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground mb-1">Volatility</p>
                              <p className="font-semibold text-foreground">{result.risk.volatility}</p>
                            </div>
                            <div className="bg-secondary/50 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground mb-1">ESG Score</p>
                              <p className="font-semibold text-foreground">{result.risk.esgScore}</p>
                            </div>
                            <div className="bg-secondary/50 rounded-lg p-3 md:col-span-1 col-span-2">
                              <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                              <p className={`font-semibold ₹{getRiskColor(result.risk.level).split(" ")[0]}`}>
                                {result.risk.level.toUpperCase()}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {result.risk.factors.map((factor, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm">
                                <Target className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{factor}</span>
                              </div>
                            ))}
                          </div>
                          <ConfidenceBar value={result.risk.confidence} label="Confidence" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!result && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-4">
              <Brain className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Ready to Analyze</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a stock ticker above to get comprehensive AI-powered insights including market trends, 
              sentiment analysis, and risk assessment.
            </p>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
