import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyToken } from "@/lib/csrf";

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const csrfToken = request.headers.get("X-CSRF-Token");
  if (!csrfToken || !verifyToken(csrfToken)) {
    return NextResponse.json(
      { message: "Invalid CSRF token" },
      { status: 401 }
    );
  }

  const { joke_id, rating } = await request.json();

  if (rating < 0 || rating > 10) {
    return NextResponse.json(
      { message: "Invalid rating value" },
      { status: 400 }
    );
  }

  try {
    console.log(
      "insert new rating, joke_id:",
      joke_id,
      ", new rating:",
      rating
    );
    const { error } = await supabase
      .from("ratings")
      .insert({ rating: rating, joke_id: joke_id });

    if (error) {
      console.error("Error while insert new rating from supabase", error);
      return NextResponse.json({ message: error, statuts: 500 });
    }

    return NextResponse.json({
      message: "Insert new rating successfuuly.",
      status: 200,
    });
  } catch (err) {
    console.error("Error while inserting new rating", err);
    return NextResponse.json({ message: err, status: 401 });
  }
}
