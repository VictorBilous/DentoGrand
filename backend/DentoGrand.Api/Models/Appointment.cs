namespace DentoGrand.Api.Models;

/// <summary>Заявка на приём.</summary>
public class Appointment
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Phone { get; set; } = "";
    public string? Comment { get; set; }

    /// <summary>Дата и время создания записи (UTC).</summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>Признак регистрации записи администратором.</summary>
    public bool IsRegistered { get; set; }
}
