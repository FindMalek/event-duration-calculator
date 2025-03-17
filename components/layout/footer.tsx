export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="text-muted-foreground container mx-auto px-4 text-center text-sm">
        <p>
          © {new Date().getFullYear()} Event Duration Calculator. All rights
          reserved.
        </p>
        <p>
          Made by a calendar nerd,{" "}
          <a
            href="https://findmalek.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-foreground/90 hover:text-secondary-foreground transition-colors duration-300 hover:underline"
          >
            findmalek.com
          </a>{" "}
          for the community.
        </p>
      </div>
    </footer>
  )
}
