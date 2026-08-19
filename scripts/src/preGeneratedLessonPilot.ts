/**
 * This is a controlled, immutable pilot manifest rather than a question-bank
 * registry. The generator itself discovers all active questions dynamically;
 * this list only chooses the founder-approved 20-item pilot sample.
 */
export const PILOT_QUESTION_IDS = [
  // Mathematics — factual, calculation, and reasoning
  "c9-m-ch1-t1-q01",
  "c9-m-ch1-t1-q06",
  "c9-m-ch1-t2-q06",
  "c9-m-ch1-t3-q08",
  "c9-m-ch1-t5-q09",
  "c9-m-ch3-t5-q07",

  // Science — Physics (3), Chemistry (3), Biology (4, including HOTS)
  "c9-phy-ch1-t1-q01",
  "c9-phy-ch1-t1-q04",
  "c9-phy-ch1-t3-q09",
  "bo-chm-9-ch02-con-001",
  "bo-chm-9-ch02-nce-001",
  "bo-chm-9-ch02-hot-005",
  "bo-bio-9-ch01-con-001",
  "bo-bio-9-ch01-con-009",
  "bo-bio-9-ch01-hot-004",
  "bo-bio-9-ch01-hot-013",

  // Information Technology — factual and applied/procedural
  "c9-it-unit1-t1-q01",
  "c9-it-unit1-t1-q07",
  "c9-it-unit1-t2-q09",
  "c9-it-unit1-t5-q06",
] as const;

export const PILOT_QUESTION_COUNT = PILOT_QUESTION_IDS.length;