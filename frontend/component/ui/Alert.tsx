interface AlertProps {
  title?: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
}

export default function Alert({
  title,
  message,
  type = "info",
}: AlertProps) {
  const styles = {
    success: "bg-green-100 border-green-500 text-green-800",
    error: "bg-red-100 border-red-500 text-red-800",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-800",
    info: "bg-blue-100 border-blue-500 text-blue-800",
  };

  return (
    <div className={`rounded-lg border-l-4 p-4 ${styles[type]}`}>
      {title && (
        <h3 className="mb-1 font-semibold">{title}</h3>
      )}
      <p>{message}</p>
    </div>
  );
}