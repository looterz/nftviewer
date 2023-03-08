import './globals.css'

export const metadata = {
  title: 'NFT Viewer',
  description: 'View NFTs from OpenSea',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
