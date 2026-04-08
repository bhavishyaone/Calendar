const CalendarShell = () => {
  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center py-10 px-4">

      <section
        id="hero-section"
        className="w-full max-w-4xl rounded-2xl bg-zinc-300 h-64 flex items-center justify-center mb-6 shadow-md"
      >
        <span className="text-zinc-600 text-xl font-semibold tracking-wide">
          🖼 Hero Section
        </span>
      </section>


      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-6">

        <section
          id="calendar-grid-section"
          className="flex-1 rounded-2xl bg-white shadow-md min-h-[380px] flex items-center justify-center"
        >
          <span className="text-zinc-400 text-lg font-medium tracking-wide">
            📅 Calendar Grid
          </span>
        </section>

        <section
          id="notes-section"
          className="w-full lg:w-72 rounded-2xl bg-white shadow-md min-h-[380px] flex items-center justify-center"
        >
          <span className="text-zinc-400 text-lg font-medium tracking-wide">
            📝 Notes Panel
          </span>
        </section>
      </div>
    </div>
  );
};

export default CalendarShell;
