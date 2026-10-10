using System.ComponentModel.DataAnnotations;

namespace DentoGrand.Api.Models;

public class CreateAppointmentDto
{
    [Required(ErrorMessage = "Укажите имя")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Имя должно содержать от 2 до 100 символов")]
    public string Name { get; set; } = "";

    [Required(ErrorMessage = "Укажите контактный телефон")]
    [RegularExpression(@"^\+?[0-9\s()\-]{6,20}$", ErrorMessage = "Некорректный номер телефона")]
    public string Phone { get; set; } = "";

    [StringLength(1000, ErrorMessage = "Комментарий не должен превышать 1000 символов")]
    public string? Comment { get; set; }
}

public class SetRegisteredDto
{
    public bool IsRegistered { get; set; }
}

public class LoginDto
{
    [Required] public string Login { get; set; } = "";
    [Required] public string Password { get; set; } = "";
}

public class PromotionDto : IValidatableObject
{
    [Required(ErrorMessage = "Укажите название")]
    [StringLength(200)]
    public string Title { get; set; } = "";

    [Required(ErrorMessage = "Укажите описание")]
    [StringLength(3000)]
    public string Description { get; set; } = "";

    [StringLength(500)]
    public string? ImageUrl { get; set; }

    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (EndDate < StartDate)
            yield return new ValidationResult("Дата окончания не может быть раньше даты начала", new[] { nameof(EndDate) });
    }
}
