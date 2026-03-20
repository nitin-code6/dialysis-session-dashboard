import PatientCard from "./PatientCard";

export default function PatientList({ data }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((p) => (
        <PatientCard key={p.patient._id} data={p} />
      ))}
    </div>
  );
}