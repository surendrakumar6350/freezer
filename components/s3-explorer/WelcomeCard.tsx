import { Card } from "../ui/card";
export function WelcomeCard({ downloading }: { downloading: boolean }) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-[var(--card)] text-[var(--card-foreground)] backdrop-blur-xl rounded-xl p-6 border">
        <h2 className="text-xl font-medium mb-4">Welcome to S3 Explorer</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Browse and manage your S3 bucket contents from this interface. Click on files to preview them here. Folders can be expanded to show their contents.
        </p>
        {downloading && (
          <div className="mt-6 bg-primary/10 text-primary px-4 py-3 rounded-lg text-sm flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            Preparing your preview...
          </div>
        )}
      </Card>
    </div>
  );
}
