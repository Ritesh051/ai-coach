
import { v } from "convex/values";
import { mutation, query } from './_generated/server';

export const createNewRoom = mutation({
  args: {
    coachOptions: v.string(),
    topic: v.string(),
    expertName: v.string(),
    conversation: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("InterviewRoom", {
      coachOptions: args.coachOptions,
      topic: args.topic,
      expertName: args.expertName,
      conversation: args.conversation ?? null,
    });
  },
});

export const GetDiscussionRoom = query({
  args: {
    id: v.id("InterviewRoom")
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.get("InterviewRoom", args.id);
    return result;
  }
});

export const updateDiscussionRoom = mutation({
  args: {
    id: v.id("InterviewRoom"),
    conversation: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const updated = await ctx.db.patch("InterviewRoom", args.id, {
      conversation: args.conversation,
    });
    return updated;
  }
});

export const updateSummary = mutation({
  args: {
    id: v.id("InterviewRoom"),
    summary: v.any(),
  },
  handler: async (ctx, args) => {
    const updated = await ctx.db.patch("InterviewRoom", args.id, {
      summary: args.summary,
    });
    return updated;
  }
});
