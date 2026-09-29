type Props = { area?: string }

export function FoundationPage({ area = 'Ventiq Console' }: Props) {
  return (
    <section className="foundation">
      <p className="eyebrow">VENTIQ PLATFORM</p>
      <h1>{area}</h1>
      <p>
        Architecture foundation is ready. Product use cases are intentionally
        left for the implementation phase.
      </p>
      <div className="notice">
        Start with the internal Admin vertical slice documented in the README
        and product documentation.
      </div>
    </section>
  )
}
