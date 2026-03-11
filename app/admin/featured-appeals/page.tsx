import { redirect } from 'next/navigation';

export default function AdminFeaturedAppealsPage() {
  // Featured appeals are now handled directly from the Subprojects page 
  // by turning the "is_featured_campaign" flag on or off. Next step is fixing 
  // the sidebar so it doesn't navigate here anymore.
  redirect('/admin/projects');
}
