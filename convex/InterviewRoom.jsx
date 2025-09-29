
import { v } from "convex/values";
import { mutation } from './_generated/server';

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
