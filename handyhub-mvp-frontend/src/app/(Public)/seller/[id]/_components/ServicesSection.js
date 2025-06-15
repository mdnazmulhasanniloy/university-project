import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ServicesSection({ seller }) {
  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {seller?.services?.map((service) => (
            <Badge
              key={service}
              variant="blue"
              className="hover:bg-secondary/80 cursor-pointer rounded-full px-3 py-1 text-sm"
            >
              {service?.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
