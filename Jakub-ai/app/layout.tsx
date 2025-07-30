import './globals.css';

export const metadata = {
  title: 'Jakub',
  description: 'Výživový poradce',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
