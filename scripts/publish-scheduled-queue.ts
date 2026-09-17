/**
 * Autonomous Blog Queue Publishing Script
 * 
 * Cadence: Semi-Weekly (Tuesday & Friday at 06:00 GST / 02:00 UTC)
 * Usage:
 *   npx tsx scripts/publish-scheduled-queue.ts
 *   npx tsx scripts/publish-scheduled-queue.ts --force
 *   npx tsx scripts/publish-scheduled-queue.ts --id <queue-item-id>
 *   npx tsx scripts/publish-scheduled-queue.ts --status
 */

import {
  publishScheduledQueueItem,
  getBlogQueue,
  getDailyCronSettings,
  getUAEDate,
  getNextScheduledRunDate,
} from "../server/dailyBlogGenerator.ts";

async function main() {
  const args = process.argv.slice(2);
  const isForce = args.includes("--force");
  const isStatus = args.includes("--status") || args.includes("--dry-run");
  const idIdx = args.indexOf("--id");
  const specificId = idIdx !== -1 && args[idIdx + 1] ? args[idIdx + 1] : undefined;

  const uaeNow = getUAEDate();
  console.log("===============================================================================");
  console.log(" DIAS ACCOUNTING & TAX CONSULTING - SEMI-WEEKLY BLOG QUEUE ENGINE");
  console.log("===============================================================================");
  console.log(`Current UAE Time   : ${uaeNow.dayName}, ${uaeNow.dateString} at ${String(uaeNow.hours).padStart(2, "0")}:${String(uaeNow.minutes).padStart(2, "0")} GST`);
  console.log(`Publication Cadence: Tuesday & Friday at 06:00 GST`);

  if (isStatus) {
    const queue = await getBlogQueue();
    const pending = queue.filter((i) => i.status === "pending");
    const published = queue.filter((i) => i.status === "published");
    const cronSettings = await getDailyCronSettings();
    const nextRun = getNextScheduledRunDate(new Date(), false);

    console.log("\n--- QUEUE STATUS SUMMARY ---");
    console.log(`Total Drafts in Queue : ${queue.length}`);
    console.log(`Pending Drafts        : ${pending.length}`);
    console.log(`Published Articles    : ${published.length}`);
    console.log(`Next Scheduled Run    : ${nextRun.dayName}, ${nextRun.dateFormatted} (${nextRun.countdownText})`);
    console.log(`Last Execution        : ${cronSettings?.lastRun || "Never"}`);
    if (cronSettings?.lastPostTitle) {
      console.log(`Last Published Post   : "${cronSettings.lastPostTitle}"`);
    }

    if (pending.length > 0) {
      console.log("\nPending Articles In Line:");
      pending.forEach((item, index) => {
        console.log(` [${index + 1}] Priority ${item.priority || 99} | Target: ${item.targetDay || "Any"} | "${item.title}" (ID: ${item.id})`);
      });
    } else {
      console.log("\nQueue is currently empty. Next scheduled trigger will automatically synthesize search-grounded article via Gemini 2.5 Flash.");
    }

    console.log("===============================================================================\n");
    process.exit(0);
  }

  console.log(`\nExecuting Queue Publication (Force: ${isForce}, Specific ID: ${specificId || "auto-select target day/priority"})...`);
  
  try {
    const result = await publishScheduledQueueItem({
      force: isForce,
      specificId,
      triggerSource: "cli_queue_publishing_script",
    });

    console.log("\n--- RESULT ---");
    console.log(`Success            : ${result.success}`);
    console.log(`Message            : ${result.message}`);
    console.log(`Published From Queue: ${result.publishedFromQueue}`);
    if (result.blogPost) {
      console.log(`Published Article  : "${result.blogPost.title}"`);
      console.log(`Slug / ID          : ${result.blogPost.id}`);
      console.log(`Author             : ${result.blogPost.author.name} (${result.blogPost.author.role})`);
      console.log(`Tag                : ${result.blogPost.tag}`);
    }
    console.log(`Remaining in Queue : ${result.remainingQueueCount}`);
    console.log(`Next Scheduled Slot: ${result.nextScheduledSlot.dayName} (${result.nextScheduledSlot.countdownText})`);
    console.log(`Execution Duration : ${result.durationMs}ms`);
    console.log("===============================================================================\n");
    process.exit(0);
  } catch (err: any) {
    console.error("\n[Error] Script execution encountered a fatal failure:", err);
    process.exit(1);
  }
}

main();
