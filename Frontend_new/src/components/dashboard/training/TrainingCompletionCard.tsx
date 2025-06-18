
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface TrainingCompletionCardProps {
  completedModules: number;
}

const TrainingCompletionCard = ({ completedModules }: TrainingCompletionCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-purple-50 border-purple-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ready to become an interview expert?
            </h3>
            <p className="text-gray-600">
              Complete all training modules to unlock advanced features and certifications.
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {completedModules}
            </div>
            <div className="text-sm text-gray-600">Modules Completed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingCompletionCard;
