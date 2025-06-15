import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AboutSection({ seller }) {
  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">About Me</CardTitle>
      </CardHeader>

      <CardContent>
        {seller?.aboutMe ? <ContentWrapper content={seller?.aboutMe} /> : "N/A"}
      </CardContent>
    </Card>
  );
}
