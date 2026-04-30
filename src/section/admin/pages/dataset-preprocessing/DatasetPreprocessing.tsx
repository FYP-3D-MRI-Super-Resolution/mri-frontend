import { useState } from "react";
import { useNavigate } from "react-router-dom";

import UploadForm from "@/section/user/pages/upload/components/UploadForm";
import UploadSuccess from "@/section/user/pages/upload/components/UploadSuccess";
import UploadGuidelines from "@/section/user/pages/upload/components/UploadGuidelines";

const DatasetPreprocessing = () => {
  const navigate = useNavigate();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  const mode = "dataset-preprocess" as const;

  const handleUploadSuccess = (newJobId: string) => {
    setJobId(newJobId);
    setUploadSuccess(true);
  };

  return (
    <div className="px-4 py-8">
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Dataset Preprocessing
          </h1>
          <p className="mt-2 text-slate-400">
            Upload one or more MRI scans to prepare training-ready dataset
            outputs.
          </p>
        </div>

        {uploadSuccess && jobId ? (
          <UploadSuccess
            jobId={jobId}
            message="Your dataset upload has been saved and preprocessing has started. You can return to the admin dashboard to review system activity."
            primaryActionLabel="Back to Dashboard"
            onViewJobs={() => navigate("/admin/dashboard")}
            onUploadMore={() => {
              setUploadSuccess(false);
              setJobId(null);
            }}
          />
        ) : (
          <div className="card">
            <UploadForm mode={mode} onSuccess={handleUploadSuccess} />
          </div>
        )}

        <UploadGuidelines />
      </div>
    </div>
  );
};

export default DatasetPreprocessing;
