"use client";

import React from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import RenderWhen from "../RenderWhen";

interface LoadingProps {
  /**
   * Type of loading indicator to display
   * - spinner: Simple spinning loader
   * - skeleton: Skeleton placeholder for content
   * - overlay: Full screen overlay with spinner
   * - card: Card skeleton for product cards
   * - list: List skeleton for shopping lists
   */
  variant?: "spinner" | "skeleton" | "overlay" | "card" | "list";

  /**
   * Size of the loading indicator
   */
  size?: "sm" | "md" | "lg" | "xl";

  /**
   * Loading message to display
   */
  message?: string;

  /**
   * Whether to show the loading indicator
   */
  isLoading?: boolean;

  /**
   * Custom className for styling
   */
  className?: string;

  /**
   * Number of skeleton items to show (for skeleton variants)
   */
  count?: number;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const SpinnerLoader = ({
  size = "md",
  className = "",
}: {
  size?: keyof typeof sizeClasses;
  className?: string;
}) => (
  <Loader2
    className={`${sizeClasses[size]} animate-spin text-blue-600 ${className}`}
  />
);

const shimmerStyle = {
  background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite",
};

const SkeletonLoader = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="h-4 rounded-lg mb-2" style={shimmerStyle}></div>
        <div className="h-3 rounded-lg w-3/4" style={shimmerStyle}></div>
      </div>
    ))}
  </div>
);

const CardSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="h-6 rounded-lg mb-3" style={shimmerStyle}></div>
          <div className="h-4 rounded-lg mb-2" style={shimmerStyle}></div>
          <div className="h-4 rounded-lg w-2/3 mb-3" style={shimmerStyle}></div>
          <div className="flex gap-2">
            <div className="h-8 rounded-lg flex-1" style={shimmerStyle}></div>
            <div className="h-8 rounded-lg w-16" style={shimmerStyle}></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ListSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded" style={shimmerStyle}></div>
            <div className="flex-1">
              <div className="h-5 rounded-lg mb-2" style={shimmerStyle}></div>
              <div className="h-3 rounded-lg w-1/2" style={shimmerStyle}></div>
            </div>
            <div className="w-12 h-8 rounded-lg" style={shimmerStyle}></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const OverlayLoader = ({
  message,
  size = "lg",
}: {
  message?: string;
  size?: keyof typeof sizeClasses;
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-4 bg-blue-50 rounded-full">
          <ShoppingCart
            className={`${sizeClasses[size]} text-blue-600 animate-pulse`}
          />
        </div>
        <SpinnerLoader size={size} className="mb-4" />
        <RenderWhen isTrue={!!message}>
          <p className="text-slate-700 font-medium">{message}</p>
        </RenderWhen>
      </div>
    </div>
  </div>
);

export default function Loading({
  variant = "spinner",
  size = "md",
  message,
  isLoading = true,
  className = "",
  count = 3,
}: LoadingProps) {
  if (!isLoading) {
    return null;
  }

  const baseClasses = "flex items-center justify-center h-full";

  switch (variant) {
    case "spinner":
      return (
        <div className={`${baseClasses} ${className}`}>
          <div className="flex flex-col items-center gap-3">
            <SpinnerLoader size={size} />
            <RenderWhen isTrue={!!message}>
              <p className="text-slate-600 text-sm font-medium">{message}</p>
            </RenderWhen>
          </div>
        </div>
      );

    case "skeleton":
      return (
        <div className={className}>
          <SkeletonLoader count={count} />
        </div>
      );

    case "card":
      return (
        <div className={className}>
          <CardSkeleton count={count} />
        </div>
      );

    case "list":
      return (
        <div className={className}>
          <ListSkeleton count={count} />
        </div>
      );

    case "overlay":
      return <OverlayLoader message={message} size={size} />;

    default:
      return (
        <div className={`${baseClasses} ${className}`}>
          <SpinnerLoader size={size} />
        </div>
      );
  }
}
