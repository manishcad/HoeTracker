import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import PersonForm from "@/components/PersonForm";
import { redirect } from "next/navigation";

export default async function EditPersonPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const person = await prisma.person.findUnique({
    where: { id: id, userId: session.user.id }
  });

  if (!person) {
    return <div>Person not found</div>;
  }

  const initialData = {
    ...person,
    firstMet: person.firstMet ? person.firstMet.toISOString() : '',
    lastContact: person.lastContact ? person.lastContact.toISOString() : ''
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Edit Connection</h1>
      <PersonForm initialData={initialData} />
    </div>
  );
}
