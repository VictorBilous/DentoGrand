namespace DentoGrand.Api.Models;

public class AdminUser
{
    public int Id { get; set; }
    public string Login { get; set; } = "";
    public string PasswordHash { get; set; } = "";
}
