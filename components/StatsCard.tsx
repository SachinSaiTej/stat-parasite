// components/StatsCard.tsx
interface SubmissionCount {
  difficulty: string;
  count: number;
  submissions: number;
}

interface RecentSubmission {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

interface StatsCardProps {
  data: {
    allQuestionsCount: {
      difficulty: string;
      count: number;
    }[];
    matchedUser: {
      contributions: {
        points: number;
      };
      profile: {
        reputation: number;
        ranking: number;
      };
      submissionCalendar: string;
      submitStats: {
        acSubmissionNum: SubmissionCount[];
        totalSubmissionNum: SubmissionCount[];
      };
    };
    recentSubmissionList: RecentSubmission[];
  };
}

export default function StatsCard({ data }: StatsCardProps) {
  const getSubmissionStats = (difficulty: string) => {
    const solved = data.matchedUser.submitStats.acSubmissionNum.find(
      (stat) => stat.difficulty === difficulty
    );
    const total = data.allQuestionsCount.find(
      (stat) => stat.difficulty === difficulty
    );
    return {
      solved: solved?.count || 0,
      total: total?.count || 0,
      submissions: solved?.submissions || 0,
    };
  };

  const calculateAcceptanceRate = (difficulty: string) => {
    const stats = data.matchedUser.submitStats.acSubmissionNum.find(
      (stat) => stat.difficulty === difficulty
    );
    const totalStats = data.matchedUser.submitStats.totalSubmissionNum.find(
      (stat) => stat.difficulty === difficulty
    );
    if (!stats || !totalStats || totalStats.submissions === 0) return 0;
    return ((stats.submissions / totalStats.submissions) * 100).toFixed(1);
  };

  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString();
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg border">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">LeetCode Stats</h2>
          <p className="text-gray-600">
            Contribution Points: {data.matchedUser.contributions.points}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">
            Rank: #{data.matchedUser.profile.ranking}
          </p>
          <p className="text-sm text-gray-600">
            Reputation: {data.matchedUser.profile.reputation}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {["Easy", "Medium", "Hard"].map((difficulty) => {
          const stats = getSubmissionStats(difficulty);
          return (
            <div
              key={difficulty}
              className="p-4 rounded-lg"
              style={{
                backgroundColor:
                  difficulty === "Easy"
                    ? "#e1f5e1"
                    : difficulty === "Medium"
                    ? "#fff4e1"
                    : "#ffe1e1",
              }}
            >
              <h3 className="font-semibold mb-2">{difficulty}</h3>
              <div className="space-y-1">
                <p>
                  Solved: {stats.solved}/{stats.total}
                </p>
                <p>Submissions: {stats.submissions}</p>
                <p>Acceptance Rate: {calculateAcceptanceRate(difficulty)}%</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Recent Submissions</h3>
        <div className="space-y-2">
          {data.recentSubmissionList.slice(0, 5).map((submission, index) => (
            <div
              key={index}
              className={`p-3 rounded ${
                submission.statusDisplay === "Accepted"
                  ? "bg-green-50"
                  : "bg-red-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <a
                  href={`https://leetcode.com/problems/${submission.titleSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {submission.title}
                </a>
                <div className="text-sm">
                  <span
                    className={`${
                      submission.statusDisplay === "Accepted"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {submission.statusDisplay}
                  </span>
                  <span className="mx-2">|</span>
                  <span className="text-gray-600">
                    {formatDate(submission.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
