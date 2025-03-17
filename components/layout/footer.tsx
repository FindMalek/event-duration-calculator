export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="text-muted-foreground container mx-auto px-4 text-center text-sm">
        <p>
          © {new Date().getFullYear()} Event Duration Calculator. All rights
          reserved.
        </p>
      </div>
    </footer>
  )
}
