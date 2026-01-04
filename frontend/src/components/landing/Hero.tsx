import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center gap-10 text-center lg:gap-16">
                    <div className="flex flex-col items-center gap-6 max-w-3xl">
                        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-muted-foreground bg-muted/50 backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                            v1.0 is now live
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Master Your Body Composition
                        </h1>
                        <p className="text-lg text-muted-foreground sm:text-xl max-w-2xl leading-relaxed">
                            Stop guessing. Start tracking. Advanced analytics to help you visualize your progress, understand your metrics, and reach your fitness goals faster.
                        </p>
                        <Image
                            src="/images/hero-dashboard.png"
                            alt="Dashboard Preview"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 -z-10 h-full w-full bg-background">
                <div className="absolute top-0 right-0 -mr-40 -mt-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
                <div className="absolute bottom-0 left-0 -ml-40 -mb-40 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-[100px]" />
            </div>
        </section>
    );
}
