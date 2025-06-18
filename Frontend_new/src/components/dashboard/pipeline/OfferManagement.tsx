
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  Send, 
  Download,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const OfferManagement = ({ candidates, onOfferUpdate }) => {
  const [offerDetails, setOfferDetails] = useState({});
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const candidatesForOffer = candidates.filter(c => c.stage === "offer_stage");
  const hiredCandidates = candidates.filter(c => c.stage === "hired");

  const handleOfferCreate = (candidateId) => {
    setSelectedCandidate(candidateId);
    setOfferDetails(prev => ({
      ...prev,
      [candidateId]: {
        salary: "",
        startDate: "",
        position: "",
        benefits: "",
        deadline: "",
        ...prev[candidateId]
      }
    }));
  };

  const handleOfferSend = (candidateId) => {
    const offer = offerDetails[candidateId];
    if (!offer.salary || !offer.startDate || !offer.position) {
      alert("Please fill in all required fields");
      return;
    }

    const updatedCandidates = candidates.map(c => 
      c.id === candidateId 
        ? { 
            ...c, 
            offerSent: true,
            offerDetails: offer,
            offerSentDate: new Date().toISOString(),
            status: "offer_sent"
          }
        : c
    );
    
    onOfferUpdate(updatedCandidates);
    setSelectedCandidate(null);
  };

  const handleOfferAcceptance = (candidateId, accepted) => {
    const updatedCandidates = candidates.map(c => 
      c.id === candidateId 
        ? { 
            ...c, 
            stage: accepted ? "hired" : "offer_declined",
            status: accepted ? "hired" : "offer_declined",
            offerAccepted: accepted,
            offerResponseDate: new Date().toISOString()
          }
        : c
    );
    
    onOfferUpdate(updatedCandidates);
  };

  const updateOfferField = (candidateId, field, value) => {
    setOfferDetails(prev => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Offer Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ready for Offer</p>
                <h3 className="text-2xl font-bold mt-1">{candidatesForOffer.length}</h3>
              </div>
              <FileText className="w-8 h-8 text-pulse-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Offers Sent</p>
                <h3 className="text-2xl font-bold mt-1">
                  {candidates.filter(c => c.offerSent).length}
                </h3>
              </div>
              <Send className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Successfully Hired</p>
                <h3 className="text-2xl font-bold mt-1">{hiredCandidates.length}</h3>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidates Ready for Offer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-pulse-500" />
            Create & Send Offers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {candidatesForOffer.map((candidate) => (
              <div key={candidate.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pulse-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {candidate.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{candidate.name}</h3>
                      <p className="text-gray-600">{candidate.role}</p>
                      <Badge className="bg-green-100 text-green-800 mt-1">
                        Ready for Offer
                      </Badge>
                    </div>
                  </div>
                  
                  {candidate.offerSent ? (
                    <Badge className="bg-blue-100 text-blue-800">
                      <Send className="w-4 h-4 mr-2" />
                      Offer Sent
                    </Badge>
                  ) : (
                    <Button
                      onClick={() => handleOfferCreate(candidate.id)}
                      className="bg-pulse-500 hover:bg-pulse-600"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Create Offer
                    </Button>
                  )}
                </div>

                {selectedCandidate === candidate.id && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
                    <h4 className="font-semibold mb-4">Offer Details</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Position Title *</label>
                        <Input
                          placeholder="e.g., Senior AI Engineer"
                          value={offerDetails[candidate.id]?.position || ""}
                          onChange={(e) => updateOfferField(candidate.id, "position", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Annual Salary *</label>
                        <Input
                          placeholder="e.g., $120,000"
                          value={offerDetails[candidate.id]?.salary || ""}
                          onChange={(e) => updateOfferField(candidate.id, "salary", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Start Date *</label>
                        <Input
                          type="date"
                          value={offerDetails[candidate.id]?.startDate || ""}
                          onChange={(e) => updateOfferField(candidate.id, "startDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Response Deadline</label>
                        <Input
                          type="date"
                          value={offerDetails[candidate.id]?.deadline || ""}
                          onChange={(e) => updateOfferField(candidate.id, "deadline", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Benefits & Perks</label>
                      <Textarea
                        placeholder="Health insurance, 401k, remote work, equity, etc."
                        value={offerDetails[candidate.id]?.benefits || ""}
                        onChange={(e) => updateOfferField(candidate.id, "benefits", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleOfferSend(candidate.id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Offer Letter
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedCandidate(null)}
                      >
                        Cancel
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Preview PDF
                      </Button>
                    </div>
                  </div>
                )}

                {candidate.offerSent && !candidate.offerAccepted && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Offer Sent</p>
                        <p className="text-sm text-gray-600">
                          Sent on {new Date(candidate.offerSentDate).toLocaleDateString()} • 
                          Position: {candidate.offerDetails?.position} • 
                          Salary: {candidate.offerDetails?.salary}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleOfferAcceptance(candidate.id, true)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Mark Accepted
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleOfferAcceptance(candidate.id, false)}
                        >
                          Mark Declined
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {candidatesForOffer.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No candidates ready for offers yet.</p>
                <p className="text-sm">Complete interviews to move candidates to offer stage.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recently Hired */}
      {hiredCandidates.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Successfully Hired Candidates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hiredCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {candidate.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="font-medium">{candidate.name}</h4>
                      <p className="text-sm text-gray-600">
                        {candidate.offerDetails?.position} • {candidate.offerDetails?.salary}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-200 text-green-900">Hired</Badge>
                    {candidate.offerDetails?.startDate && (
                      <p className="text-xs text-gray-600 mt-1">
                        Starts: {new Date(candidate.offerDetails.startDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OfferManagement;
