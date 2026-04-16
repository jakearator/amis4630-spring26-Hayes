using BuckeyeMarketplaceBackend.Services;

namespace BuckeyeMarketplaceBackend.Tests.Unit;

public class PasswordRuleValidatorTests
{
    [Fact]
    public void Validate_ReturnsErrorsForMissingUppercaseAndDigit()
    {
        var errors = PasswordRuleValidator.Validate("lowercase");

        Assert.Contains("Password must contain at least one uppercase letter.", errors);
        Assert.Contains("Password must contain at least one number.", errors);
    }

    [Fact]
    public void Validate_ReturnsNoErrorsForCompliantPassword()
    {
        var errors = PasswordRuleValidator.Validate("ValidPass1");

        Assert.Empty(errors);
    }
}
