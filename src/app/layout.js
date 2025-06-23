import './globals.css'

export const metadata = {
  title: 'Food Vendor',
  description: 'Food vendor inventory management app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
