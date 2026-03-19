import { render, screen, act, fireEvent } from "@testing-library/react";
import { ReadinessMeter } from "@/components/dashboard/ReadinessMeter";

describe("ReadinessMeter", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("exposes aria-valuenow and label for percentage", () => {
    render(<ReadinessMeter percentage={62} />);
    const meter = screen.getByRole("meter", { name: /readiness: 62%/i });
    expect(meter).toHaveAttribute("aria-valuenow", "62");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "100");
  });

  it("shows On Track at 75%+ and Action Needed below", () => {
    const { rerender } = render(<ReadinessMeter percentage={80} />);
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(screen.getByText("On Track")).toBeInTheDocument();

    rerender(<ReadinessMeter percentage={40} />);
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(screen.getByText("Action Needed")).toBeInTheDocument();
  });

  it("handles 0 and 100", () => {
    const { rerender } = render(<ReadinessMeter percentage={0} />);
    act(() => jest.advanceTimersByTime(150));
    expect(screen.getByText("0%")).toBeInTheDocument();

    rerender(<ReadinessMeter percentage={100} />);
    act(() => jest.advanceTimersByTime(150));
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("invokes onCategoryClick for category buttons", () => {
    const onCategoryClick = jest.fn();
    render(<ReadinessMeter percentage={50} onCategoryClick={onCategoryClick} />);
    fireEvent.click(screen.getByRole("button", { name: /credits/i }));
    expect(onCategoryClick).toHaveBeenCalledWith("credits");
  });
});
