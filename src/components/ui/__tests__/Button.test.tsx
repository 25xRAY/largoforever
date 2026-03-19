import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders primary variant", () => {
    render(<Button variant="primary">Save</Button>);
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("handles click", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole("button", { name: /go/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading state with spinner text", () => {
    render(
      <Button isLoading loadingText="Saving…">
        Save
      </Button>
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Saving…")).toBeInTheDocument();
  });

  it("disabled prevents click", () => {
    const onClick = jest.fn();
    render(
      <Button disabled onClick={onClick}>
        Nope
      </Button>
    );
    fireEvent.click(screen.getByRole("button", { name: /nope/i }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("secondary and outline variants render", () => {
    const { rerender } = render(<Button variant="secondary">A</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
    rerender(<Button variant="outline">B</Button>);
    expect(screen.getByRole("button", { name: /b/i })).toBeInTheDocument();
  });
});
