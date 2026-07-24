import NotificationCard from "./NotificationCard";

const notifications = [
  {
    title: "Document Uploaded",
    message: "HR_Policy_2025.pdf uploaded successfully.",
    time: "5 minutes ago",
  },
  {
    title: "Knowledge Base Updated",
    message: "Engineering Guide has been indexed.",
    time: "1 hour ago",
  },
  {
    title: "Admin Notice",
    message: "New user role permissions available.",
    time: "Yesterday",
  },
];

export default function NotificationList() {
  return (
    <div className="space-y-4">
      {notifications.map((notification, index) => (
        <NotificationCard
          key={index}
          title={notification.title}
          message={notification.message}
          time={notification.time}
        />
      ))}
    </div>
  );
}