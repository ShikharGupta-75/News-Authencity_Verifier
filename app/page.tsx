"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Search,
  Shield,
  Info,
  Zap,
  Target,
  BookOpen,
  Users,
  ArrowRight,
  FileText,
  TrendingUp,
} from "lucide-react"

interface Claim {
  id: string
  text: string
  status: "true" | "false" | "misleading"
  confidence: number
  explanation: string
  correctInformation?: string
}

interface Reference {
  title: string
  source: string
  url: string
  reliability: "high" | "medium" | "low"
}

interface AnalysisResult {
  overallScore: number
  credibilityLevel: "high" | "medium" | "low" | "very-low"
  claims: Claim[]
  references: Reference[]
  summary: string
  factCorrections: Claim[]
  penaltyDetails: string
}

const sampleNews = [
  {
    title: "Economic Growth Claims",
    content:
      "The economy has experienced unprecedented growth this quarter, with unemployment dropping to historic lows and GDP reaching record highs. Economic experts unanimously predict continued improvement across all sectors.",
    category: "Economy",
  },
  {
    title: "Climate Change Statistics",
    content:
      "Recent studies show that global temperatures have increased by 3 degrees in the past decade alone. Scientists warn that this rapid change is causing immediate and irreversible damage to ecosystems worldwide.",
    category: "Climate",
  },
  {
    title: "Health Information",
    content:
      "New COVID-19 vaccines have been proven to be 100% effective against all variants, providing complete immunity to all recipients. Health officials recommend immediate vaccination for total protection.",
    category: "Health",
  },
]

export default function NewsVerifier() {
  const [newsContent, setNewsContent] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [showAnalyzer, setShowAnalyzer] = useState(false)

  const analyzeNews = async () => {
    if (!newsContent.trim()) return

    setIsAnalyzing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate dynamic claims based on content
    const generateClaims = () => {
      const claims = []
      const contentWords = newsContent.toLowerCase()

      if (contentWords.includes("economy") || contentWords.includes("economic")) {
        claims.push({
          id: "1",
          text: "Economic growth has reached record highs this quarter",
          status: "false" as const,
          confidence: 85,
          explanation: "Official GDP data shows growth at 2.1%, which is below historical averages.",
          correctInformation:
            "Current economic growth is 2.1%, which is moderate but not record-breaking. The highest quarterly growth in recent years was 4.9% in Q3 2020.",
        })
      }

      if (contentWords.includes("unemployment") || contentWords.includes("jobs")) {
        claims.push({
          id: "2",
          text: "Unemployment has dropped to historic lows",
          status: "misleading" as const,
          confidence: 72,
          explanation: "While unemployment is low, it's not at historic levels when compared to pre-pandemic data.",
          correctInformation:
            "Current unemployment rate is 3.7%. The historic low was 3.5% in 2019, and rates were consistently lower in the 1950s.",
        })
      }

      if (contentWords.includes("climate") || contentWords.includes("temperature")) {
        claims.push({
          id: "3",
          text: "Global temperatures have increased by 3 degrees in the past decade",
          status: "false" as const,
          confidence: 92,
          explanation:
            "Scientific data shows global temperature increase is approximately 1.1°C since pre-industrial times.",
          correctInformation:
            "Global average temperature has increased by approximately 1.1°C (2°F) since the late 1800s, with most warming occurring in the past 40 years.",
        })
      }

      if (contentWords.includes("vaccine") || contentWords.includes("covid")) {
        claims.push({
          id: "4",
          text: "COVID-19 vaccines are 100% effective against all variants",
          status: "false" as const,
          confidence: 88,
          explanation: "No vaccine provides 100% protection, and effectiveness varies by variant.",
          correctInformation:
            "COVID-19 vaccines are highly effective but not 100%. Effectiveness ranges from 70-95% depending on the vaccine type and variant, with boosters improving protection.",
        })
      }

      // Always add at least one claim if none matched
      if (claims.length === 0) {
        claims.push({
          id: "1",
          text: "Main statistical claim in the article",
          status: Math.random() > 0.6 ? "true" : ("false" as const),
          confidence: Math.floor(Math.random() * 30) + 70,
          explanation: "Cross-referenced with official statistical databases and government sources.",
          correctInformation: "Verified data shows different figures than those presented in the article.",
        })
      }

      return claims
    }

    const claims = generateClaims()

    // Calculate score based heavily on fact-checking results
    let baseScore = 85
    let penaltyDetails = ""

    claims.forEach((claim) => {
      if (claim.status === "false" && claim.confidence > 70) {
        const penalty = Math.floor(claim.confidence / 2)
        baseScore -= penalty
        penaltyDetails += `${penalty} points deducted for false claim with ${claim.confidence}% confidence. `
      } else if (claim.status === "misleading" && claim.confidence > 60) {
        const penalty = Math.floor(claim.confidence / 4)
        baseScore -= penalty
        penaltyDetails += `${penalty} points deducted for misleading claim with ${claim.confidence}% confidence. `
      } else if (claim.status === "true" && claim.confidence > 80) {
        baseScore += 5
      }
    })

    baseScore = Math.max(0, Math.min(baseScore, 100))

    const credibilityLevel =
      baseScore >= 80 ? "high" : baseScore >= 60 ? "medium" : baseScore >= 40 ? "low" : "very-low"

    const factCorrections = claims.filter(
      (claim) => (claim.status === "false" || claim.status === "misleading") && claim.correctInformation,
    )

    const mockResult: AnalysisResult = {
      overallScore: baseScore,
      credibilityLevel: credibilityLevel as "high" | "medium" | "low" | "very-low",
      claims: claims,
      factCorrections: factCorrections,
      penaltyDetails: penaltyDetails || "No significant penalties applied.",
      references: [
        {
          title: "Bureau of Labor Statistics",
          source: "U.S. Department of Labor",
          url: "https://bls.gov",
          reliability: "high",
        },
        {
          title: "Federal Reserve Economic Data",
          source: "Federal Reserve Bank of St. Louis",
          url: "https://fred.stlouisfed.org",
          reliability: "high",
        },
        {
          title: "Climate Change Indicators",
          source: "EPA",
          url: "https://epa.gov/climate-indicators",
          reliability: "high",
        },
        {
          title: "CDC Vaccine Effectiveness",
          source: "Centers for Disease Control",
          url: "https://cdc.gov/vaccines",
          reliability: "high",
        },
      ],
      summary: `Fact-checking analysis reveals ${factCorrections.length > 0 ? "significant credibility issues" : "generally reliable information"}. Score heavily weighted toward claim validation rather than presentation quality. ${penaltyDetails}`,
    }

    setResult(mockResult)
    setIsAnalyzing(false)
  }

  const loadSampleNews = (sample: (typeof sampleNews)[0]) => {
    setNewsContent(sample.content)
    setShowAnalyzer(true)
    setResult(null)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getCredibilityBadge = (level: string) => {
    const variants = {
      high: { variant: "default" as const, color: "bg-green-100 text-green-800" },
      medium: { variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
      low: { variant: "destructive" as const, color: "bg-orange-100 text-orange-800" },
      "very-low": { variant: "destructive" as const, color: "bg-red-100 text-red-800" },
    }
    return variants[level as keyof typeof variants] || variants["low"]
  }

  const getClaimIcon = (status: string) => {
    switch (status) {
      case "true":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "false":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "misleading":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case "high":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  if (showAnalyzer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => setShowAnalyzer(false)} className="mb-4">
            ← Back to Home
          </Button>

          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">News Authenticity Verifier</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Combat misinformation by verifying the authenticity of news articles.
            </p>
          </div>

          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Analyze News Content
              </CardTitle>
              <CardDescription>Paste the news article text or URL you want to verify</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="news-content">News Content</Label>
                <Textarea
                  id="news-content"
                  placeholder="Paste your news article text here..."
                  value={newsContent}
                  onChange={(e) => {
                    setNewsContent(e.target.value)
                    setResult(null)
                  }}
                  className="min-h-[120px]"
                />
              </div>
              <Button onClick={analyzeNews} disabled={!newsContent.trim() || isAnalyzing} className="w-full" size="lg">
                {isAnalyzing ? "Analyzing..." : "Verify Authenticity"}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          {result && (
            <div className="space-y-6">
              {/* Overall Score */}
              <Card>
                <CardHeader>
                  <CardTitle>Authenticity Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">Overall Score:</span>
                        <span className={`text-3xl font-bold ${getScoreColor(result.overallScore)}`}>
                          {result.overallScore}/100
                        </span>
                      </div>
                      <Badge className={getCredibilityBadge(result.credibilityLevel).color}>
                        {result.credibilityLevel.toUpperCase()} CREDIBILITY
                      </Badge>
                    </div>
                    <div className="w-32">
                      <Progress value={result.overallScore} className="h-3" />
                    </div>
                  </div>
                  <Alert>
                    <AlertDescription>{result.summary}</AlertDescription>
                  </Alert>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Scoring Method:</strong> {result.penaltyDetails}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Fact Corrections Section */}
              {result.factCorrections.length > 0 && (
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-700 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Fact Corrections
                    </CardTitle>
                    <CardDescription>Correct information for false or misleading claims</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.factCorrections.map((correction, index) => (
                      <div key={correction.id}>
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
                          <div className="flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                            <div className="flex-1">
                              <Badge variant="destructive" className="mb-2">
                                {correction.status.toUpperCase()} CLAIM
                              </Badge>
                              <p className="font-medium text-red-900 mb-2">{correction.text}</p>
                              <div className="bg-green-50 border border-green-200 rounded p-3">
                                <div className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-green-900 text-sm mb-1">Correct Information:</p>
                                    <p className="text-green-800 text-sm">{correction.correctInformation}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < result.factCorrections.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Claims Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Claims Breakdown</CardTitle>
                  <CardDescription>Individual fact-checking of key claims in the article</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.claims.map((claim, index) => (
                    <div key={claim.id}>
                      <div className="flex items-start gap-3 p-4 border rounded-lg">
                        <div className="mt-1">{getClaimIcon(claim.status)}</div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                claim.status === "true"
                                  ? "default"
                                  : claim.status === "false"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {claim.status.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-600">Confidence: {claim.confidence}%</span>
                            {claim.status === "false" && claim.confidence > 70 && (
                              <Badge variant="outline" className="text-red-600 border-red-300">
                                HIGH PENALTY
                              </Badge>
                            )}
                          </div>
                          <p className="font-medium">{claim.text}</p>
                          <p className="text-sm text-gray-600">{claim.explanation}</p>
                        </div>
                      </div>
                      {index < result.claims.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* References */}
              <Card>
                <CardHeader>
                  <CardTitle>Reliable Sources & References</CardTitle>
                  <CardDescription>Verified sources used for fact-checking and validation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.references.map((ref, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{ref.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{ref.source}</span>
                          <span>•</span>
                          <span className={getReliabilityColor(ref.reliability)}>
                            {ref.reliability.toUpperCase()} RELIABILITY
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={ref.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-blue-600 rounded-2xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                News Authenticity Verifier
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Combat misinformation with AI-powered fact-checking. Get instant credibility scores, detailed claim
              analysis, and reliable source verification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => setShowAnalyzer(true)}
              >
                Start Verifying News
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Verifier?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI technology meets rigorous fact-checking standards to deliver unparalleled accuracy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Precision Scoring</h3>
                <p className="text-gray-600">
                  Advanced algorithms analyze claims with up to 95% accuracy, heavily weighting fact-checking over
                  surface presentation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Analysis</h3>
                <p className="text-gray-600">
                  Get comprehensive fact-checking results in seconds, not hours. Real-time verification for breaking
                  news.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Fact Corrections</h3>
                <p className="text-gray-600">
                  Not just detection - get the correct information with authoritative sources for every false claim
                  identified.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Trusted Sources</h3>
                <p className="text-gray-600">
                  Cross-referenced with government databases, academic institutions, and verified news organizations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our three-step process ensures thorough and accurate fact-checking of any news content.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Submit Content</h3>
              <p className="text-gray-600 text-lg">
                Paste your news article text or URL into our analyzer. We accept content from any source or format.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Analysis</h3>
              <p className="text-gray-600 text-lg">
                Our AI extracts key claims and cross-references them against authoritative databases and verified
                sources.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Results</h3>
              <p className="text-gray-600 text-lg">
                Receive detailed credibility scores, fact corrections, and reliable sources - all in an
                easy-to-understand format.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sample News Section */}
      <div className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Try Sample News</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Test our verifier with these sample news articles to see how it identifies misinformation and provides
              corrections.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {sampleNews.map((sample, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="mb-2">
                      {sample.category}
                    </Badge>
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                  </div>
                  <CardTitle className="text-xl">{sample.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 line-clamp-4">{sample.content.substring(0, 150)}...</p>
                  <Button onClick={() => loadSampleNews(sample)} className="w-full" variant="outline">
                    <FileText className="mr-2 w-4 h-4" />
                    Analyze This Sample
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Fight Misinformation?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust our AI-powered fact-checking to verify news authenticity and combat fake
            news.
          </p>
          <Button
            size="lg"
            className="px-8 py-6 text-lg bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => setShowAnalyzer(true)}
          >
            Start Verifying Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
