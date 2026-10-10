using DentoGrand.Api.Data;
using DentoGrand.Api.Models;
using DentoGrand.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DentoGrand.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IPasswordHasher<AdminUser> _hasher;
    private readonly TokenService _tokens;

    public AuthController(AppDbContext db, IPasswordHasher<AdminUser> hasher, TokenService tokens)
    {
        _db = db;
        _hasher = hasher;
        _tokens = tokens;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _db.AdminUsers.FirstOrDefaultAsync(u => u.Login == dto.Login);
        var ok = user != null &&
                 _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password) != PasswordVerificationResult.Failed;

        if (!ok)
        {
            await Task.Delay(500); // небольшое замедление перебора пароля
            return Unauthorized(new { message = "Неверный логин или пароль" });
        }

        return Ok(new { token = _tokens.Create(user!), login = user!.Login });
    }
}
