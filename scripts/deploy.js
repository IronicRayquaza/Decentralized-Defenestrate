async function main(candidateNames, votingTime) {
  if (!candidateNames || !votingTime) {
    throw new Error("Candidate names and voting time are required");
  }

  if (!Array.isArray(candidateNames) || candidateNames.length === 0) {
    throw new Error("Candidate names must be an array with at least one element");
  }

  if (typeof votingTime !== "number" || votingTime <= 0) {
    throw new Error("Voting time must be a positive number");
  }

  const Voting = await ethers.getContractFactory("Voting");

  try {
    const Voting_ = await Voting.deploy(candidateNames, votingTime);
    console.log(`Contract address: ${Voting_.address}`);
    console.log("Deployment successful!");
    process.exit(0);
  } catch (error) {
    console.error(`Deployment failed: ${error}`);
    process.exit(1);
  }
}

if (require.main === module) {
  const candidateNames = process.env.CANDIDATE_NAMES ? process.env.CANDIDATE_NAMES.split(",") : [];
  const votingTime = process.env.VOTING_TIME ? parseInt(process.env.VOTING_TIME, 10) : 0;
  main(candidateNames, votingTime);
}