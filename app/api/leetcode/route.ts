// app/api/leetcode/route.ts
import { NextResponse } from 'next/server'

const LEETCODE_API_URL = 'https://leetcode.com/graphql'

const query = `
  query getUserProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      contributions {
        points
      }
      profile {
        reputation
        ranking
      }
      submissionCalendar
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
    recentSubmissionList(username: $username) {
      title
      titleSlug
      timestamp
      statusDisplay
      lang
    }
  }
`

export async function POST(req: Request) {
    try {
        const { username } = await req.json()

        const response = await fetch(LEETCODE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com'
            },
            body: JSON.stringify({
                query,
                variables: { username },
            }),
        })

        const data = await response.json()

        if (data.errors) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(data.data)
    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to fetch user data' },
            { status: 500 }
        )
    }
}