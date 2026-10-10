namespace DentoGrand.Api.Models;

public class Promotion
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string? ImageUrl { get; set; }

    /// <summary>Начало срока действия (включительно).</summary>
    public DateOnly StartDate { get; set; }

    /// <summary>Конец срока действия (включительно).</summary>
    public DateOnly EndDate { get; set; }
}
