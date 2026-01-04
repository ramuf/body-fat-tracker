import Link from "next/link";
import { Activity } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-background py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        <span className="text-lg font-bold">Body Fat Tracker</span>
                    </div>

                    <div className="flex gap-8 text-sm text-muted-foreground">
                        <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Body Fat Tracker. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
