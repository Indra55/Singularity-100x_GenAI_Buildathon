
import React from "react";
import EnhancedAICoach from "./EnhancedAICoach";

// Re-export the enhanced version with the same interface
const AICoachAssistant = (props: any) => {
  return <EnhancedAICoach {...props} />;
};

export default AICoachAssistant;
