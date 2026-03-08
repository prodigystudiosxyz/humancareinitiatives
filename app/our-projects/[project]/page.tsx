import { redirect } from 'next/navigation';

type Props = {
    params: Promise<{
        project: string;
    }>;
};

export default async function ProjectPage({ params }: Props) {
    const { project } = await params;
    redirect(`/our-projects/subprojects?project=${project}`);
}
