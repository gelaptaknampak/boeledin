"use client";

import { Suspense } from "react";
import SectionFormContent from "./SectionFormContent";

type Props = {
  data: any;
  config: any;
};

function SectionFormLoading() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="text-sm text-muted-foreground">
        Loading form...
      </div>
    </div>
  );
}

export default function SectionForm({ data, config }: Props) {
  return (
    <Suspense fallback={<SectionFormLoading />}>
      <SectionFormContent
        data={data}
        config={config}
      />
    </Suspense>
  );
}