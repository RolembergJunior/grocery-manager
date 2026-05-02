import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { COLLECTIONS } from "@/lib/helpers/constants";
import { SUBSCRIPTION_STATUS } from "@/app/type";

const GRACE_PERIOD_DAYS = 5;

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const profileRef = adminDb.collection(COLLECTIONS.PROFILES).doc(userId);
    const profileDoc = await profileRef.get();

    if (!profileDoc.exists) {
      return NextResponse.json(
        { error: "Perfil não encontrado" },
        { status: 404 },
      );
    }

    const profile = profileDoc.data();

    if (
      !profile?.subscriptionStatus ||
      profile.subscriptionStatus === SUBSCRIPTION_STATUS.FREE ||
      !profile.subscriptionEndDate
    ) {
      return NextResponse.json({
        updated: false,
        inGracePeriod: false,
        daysRemainingInGrace: 0,
        newStatus: profile?.subscriptionStatus || SUBSCRIPTION_STATUS.FREE,
      });
    }

    const endDate = new Date(profile.subscriptionEndDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (today <= endDate) {
      return NextResponse.json({
        updated: false,
        inGracePeriod: false,
        daysRemainingInGrace: 0,
        newStatus: profile.subscriptionStatus,
      });
    }

    const gracePeriodEnd = new Date(endDate);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + GRACE_PERIOD_DAYS);

    if (today <= gracePeriodEnd) {
      const daysRemaining = Math.ceil(
        (gracePeriodEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      return NextResponse.json({
        updated: false,
        inGracePeriod: true,
        daysRemainingInGrace: daysRemaining,
        newStatus: profile.subscriptionStatus,
      });
    }

    const previousStatus = profile.subscriptionStatus;
    await profileRef.update({
      subscriptionStatus: SUBSCRIPTION_STATUS.FREE,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      updated: true,
      inGracePeriod: false,
      daysRemainingInGrace: 0,
      previousStatus,
      newStatus: SUBSCRIPTION_STATUS.FREE,
    });
  } catch (error) {
    console.error("Error checking subscription expiration:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
