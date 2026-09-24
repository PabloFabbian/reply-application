"use client";

import { useLinkStatus } from "next/link";

export function LinkPending() {
    const { pending } = useLinkStatus();
    return pending ? <span data-pending="" hidden /> : null;
}