import { BarChart3, Shield, Zap, Smartphone } from "lucide-react";

const features = [
    {
        icon: BarChart3,
        title: "Visual Analytics",
        description: "Visualize your body fat percentage, muscle mass, and weight trends over time with interactive charts.",
    },
    {
        icon: Shield,
        title: "Secure & Private",
        description: "Your health data is sensitive. We encrypt everything and ensure your privacy is our top priority.",
    },
    {
        icon: Zap,
        title: "Instant Insights",
        description: "Get immediate feedback on your progress. Set goals and track your achievements effortlessly.",
    },
    {
        icon: Smartphone,
        title: "Mobile Friendly",
        description: "Access your dashboard from anywhere. Optimized for all devices so you can track on the go.",
    },
];

export function Features() {
    return (
        <section id="features" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center text-center gap-4 mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Everything you need to succeed
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Powerful features designed to help you stay consistent and motivated on your journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
