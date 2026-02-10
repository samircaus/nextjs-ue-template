import Image from "next/image";

export const metadata = {
  title: "About | WKND",
  description: "Learn more about WKND — adventure and travel stories for the weekend enthusiast.",
};

export default function AboutPage() {
  const team = [
    {
      name: "Jane Doe",
      role: "Founder & CEO",
      bio: "Passionate about building tools that empower developers.",
    },
    {
      name: "John Smith",
      role: "Head of Engineering",
      bio: "10+ years of experience in full-stack development.",
    },
    {
      name: "Emily Chen",
      role: "Lead Designer",
      bio: "Creating beautiful and intuitive user experiences.",
    },
    {
      name: "Michael Johnson",
      role: "Developer Advocate",
      bio: "Helping developers succeed with our platform.",
    },
  ];

  const values = [
    {
      title: "Innovation",
      description:
        "We constantly push boundaries to create cutting-edge solutions that solve real problems.",
    },
    {
      title: "Quality",
      description:
        "Every product we build meets the highest standards of code quality and user experience.",
    },
    {
      title: "Community",
      description:
        "We believe in the power of community and actively contribute to open source.",
    },
    {
      title: "Transparency",
      description:
        "We operate with honesty and openness in everything we do.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="border-b border-zinc-200 bg-white px-6 py-20 dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            About WKND
          </h1>
          <p className="text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
            WKND is your guide to stories and adventures for the weekend
            enthusiast — from magazine features to curated trips.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="border-b border-zinc-200 bg-zinc-50 px-6 py-20 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Our Mission
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            WKND brings together travel stories, outdoor adventures, and
            curated experiences. Our magazine and adventures are built to
            inspire your next weekend.
          </p>
          <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Content is currently loaded from our data layer; we’re set up to
            connect to GraphQL when you’re ready, so the same structure will
            power the site from a headless CMS or API.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="border-b border-zinc-200 bg-white px-6 py-20 dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Our Values
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h3 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-zinc-50 px-6 py-20 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Meet the Team
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div
                key={member.name}
                className="text-center"
              >
                <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-zinc-200 text-4xl font-bold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300 mx-auto">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {member.name}
                </h3>
                <p className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {member.role}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-500">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-zinc-200 bg-white px-6 py-20 dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-zinc-900 dark:text-zinc-50">
                10K+
              </div>
              <div className="text-zinc-600 dark:text-zinc-400">
                Active Developers
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-zinc-900 dark:text-zinc-50">
                16+
              </div>
              <div className="text-zinc-600 dark:text-zinc-400">
                Adventures
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-zinc-900 dark:text-zinc-50">
                7
              </div>
              <div className="text-zinc-600 dark:text-zinc-400">
                Magazine Articles
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-zinc-200 bg-zinc-50 px-6 py-20 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Want to Join Us?
          </h2>
          <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
            We're always looking for talented individuals to join our team.
          </p>
          <button className="rounded-full bg-zinc-900 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
            View Open Positions
          </button>
        </div>
      </section>
    </div>
  );
}
