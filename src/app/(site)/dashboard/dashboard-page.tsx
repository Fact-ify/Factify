'use client';

import { motion } from 'framer-motion';
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  Bookmark,
  BarChart3,
  PieChart,
  TrendingUp,
} from 'lucide-react';
import DashboardCard from '@/components/factify/dashboard-card';
import TrendCard from '@/components/factify/trend-card';
import ConfidenceMeter from '@/components/factify/confidence-meter';
import { dashboardSummary } from '@/data/mock/dashboard';
import { trendingFakeNews } from '@/data/mock/trending';
import { verificationReports } from '@/data/mock/reports';

export default function DashboardPage() {
  const { weeklyActivity, credibilityDistribution, popularCategories, sourceReliabilityTrends } =
    dashboardSummary;

  const maxActivity = Math.max(...weeklyActivity);

  return (
    <div className="py-12 lg:py-16 bg-factify-gray/20 min-h-screen">
      <div className="wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-factify-navy mb-2">Dashboard</h1>
          <p className="text-factify-gray-dark">
            Your verification analytics and activity overview.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <DashboardCard
            title="Total Searches"
            value={dashboardSummary.totalSearches}
            icon={Search}
            change="+12% this week"
            changeType="positive"
            index={0}
          />
          <DashboardCard
            title="Verified Stories"
            value={dashboardSummary.verifiedStories}
            icon={ShieldCheck}
            change="+8% this week"
            changeType="positive"
            index={1}
          />
          <DashboardCard
            title="Fake News Detected"
            value={dashboardSummary.fakeNewsDetected}
            icon={AlertTriangle}
            change="+3 today"
            changeType="negative"
            index={2}
          />
          <DashboardCard
            title="Saved Reports"
            value={dashboardSummary.savedReports}
            icon={Bookmark}
            change="+15 this month"
            changeType="positive"
            index={3}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl border border-factify-gray bg-white"
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-factify-gold" />
              <h2 className="text-lg font-semibold text-factify-navy">Verification Activity</h2>
            </div>
            <div className="flex items-end justify-between gap-3 h-48">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={day} className="flex flex-col items-center gap-2 flex-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(weeklyActivity[i] / maxActivity) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                    className="w-full rounded-t-lg gradient-gold min-h-[8px]"
                  />
                  <span className="text-xs text-factify-gray-dark">{day}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl border border-factify-gray bg-white"
          >
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="h-5 w-5 text-factify-gold" />
              <h2 className="text-lg font-semibold text-factify-navy">Credibility Distribution</h2>
            </div>
            <div className="space-y-4">
              <ConfidenceMeter
                value={credibilityDistribution.high}
                label="High Credibility Sources"
                size="lg"
              />
              <ConfidenceMeter
                value={credibilityDistribution.medium}
                label="Medium Credibility Sources"
                size="lg"
              />
              <ConfidenceMeter
                value={credibilityDistribution.low}
                label="Low Credibility Sources"
                size="lg"
              />
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl border border-factify-gray bg-white"
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-factify-gold" />
              <h2 className="text-lg font-semibold text-factify-navy">Popular Categories</h2>
            </div>
            <div className="space-y-3">
              {popularCategories.map((cat) => {
                const maxCount = popularCategories[0].count;
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-factify-navy">{cat.name}</span>
                      <span className="text-factify-gray-dark">{cat.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-factify-gray overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(cat.count / maxCount) * 100}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-xl border border-factify-gray bg-white"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-factify-gold" />
              <h2 className="text-lg font-semibold text-factify-navy">Source Reliability Trends</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-factify-gray">
                    <th className="text-left py-2 font-medium text-factify-gray-dark">Month</th>
                    <th className="text-right py-2 font-medium text-factify-navy">Reuters</th>
                    <th className="text-right py-2 font-medium text-factify-navy">BBC</th>
                    <th className="text-right py-2 font-medium text-factify-navy">AP</th>
                  </tr>
                </thead>
                <tbody>
                  {sourceReliabilityTrends.map((row) => (
                    <tr key={row.month} className="border-b border-factify-gray/50">
                      <td className="py-2.5 text-factify-gray-dark">{row.month}</td>
                      <td className="py-2.5 text-right font-medium text-factify-gold">{row.reuters}%</td>
                      <td className="py-2.5 text-right font-medium text-factify-navy">{row.bbc}%</td>
                      <td className="py-2.5 text-right font-medium text-factify-navy">{row.ap}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-10"
        >
          <h2 className="text-lg font-semibold text-factify-navy mb-4">Recent Verifications</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {verificationReports.slice(0, 4).map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-xl border border-factify-gray bg-white flex items-center justify-between"
              >
                <div className="min-w-0 flex-1 mr-4">
                  <p className="text-sm font-medium text-factify-navy truncate">{report.claim}</p>
                  <p className="text-xs text-factify-gray-dark mt-1">{report.createdAt}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                    report.verdict.includes('False')
                      ? 'bg-red-50 text-red-700'
                      : report.verdict.includes('True')
                        ? 'bg-green-50 text-green-700'
                        : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {report.verdict}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-lg font-semibold text-factify-navy mb-4">Trending Misinformation</h2>
          <div className="space-y-3">
            {trendingFakeNews.slice(0, 5).map((trend, index) => (
              <TrendCard key={trend.id} trend={trend} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
