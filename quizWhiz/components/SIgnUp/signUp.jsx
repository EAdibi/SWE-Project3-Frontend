import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

const SignUp = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const windowWidth = Dimensions.get("window").width;
  const isMobile = windowWidth < 768;

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === "Enter" && !isLoading) {
        handleSignUp();
      }
    },
    [isLoading]
  );

  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleKeyPress]);

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    handleSignUp();
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!firstName.trim()) {
      tempErrors.firstName = "First Name is required";
      isValid = false;
    }

    if (!lastName.trim()) {
      tempErrors.lastName = "Last Name is required";
      isValid = false;
    }

    if (!email.trim()) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!password.trim()) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (password !== confirm) {
      tempErrors.confirm = "Passwords should Match";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSignUp = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      setIsLoading(true);

      const response = await axios.post(
        "https://quizwhiz-backend-679124120937.us-central1.run.app/users/signup",
        {
          username: `${firstName.trim()}${lastName.trim()}`.toLowerCase(),
          password: password.trim(),
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }
      );

      if (response.status === 201 || response.status === 200) {
        router.replace("/");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setErrors({
        general:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error.message ||
          "An error occurred during signup",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.replace("/");
  };

  const renderForm = () => (
    <View style={styles.formWrapper}>
      <Text style={styles.title}>Create Account</Text>
      <View as="form" onSubmit={handleSubmit} style={{ width: "100%" }}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            placeholder="Enter your First Name"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              setErrors((prev) => ({ ...prev, firstName: "", general: "" }));
            }}
            editable={!isLoading}
            placeholderTextColor="#94a3b8"
            onSubmitEditing={handleSubmit}
          />
          {errors.firstName && (
            <Text style={styles.errorText}>{errors.firstName}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={[styles.input, errors.lastName && styles.inputError]}
            placeholder="Enter your Last Name"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              setErrors((prev) => ({ ...prev, lastName: "", general: "" }));
            }}
            editable={!isLoading}
            placeholderTextColor="#94a3b8"
            onSubmitEditing={handleSubmit}
          />
          {errors.lastName && (
            <Text style={styles.errorText}>{errors.lastName}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors((prev) => ({ ...prev, email: "", general: "" }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
            placeholderTextColor="#94a3b8"
            onSubmitEditing={handleSubmit}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors((prev) => ({ ...prev, password: "", general: "" }));
            }}
            secureTextEntry
            editable={!isLoading}
            placeholderTextColor="#94a3b8"
            onSubmitEditing={handleSubmit}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={[styles.input, errors.confirm && styles.inputError]}
            placeholder="Confirm password"
            value={confirm}
            onChangeText={(text) => {
              setConfirm(text);
              setErrors((prev) => ({ ...prev, confirm: "", general: "" }));
            }}
            secureTextEntry
            editable={!isLoading}
            placeholderTextColor="#94a3b8"
            onSubmitEditing={handleSubmit}
          />
          {errors.confirm && (
            <Text style={styles.errorText}>{errors.confirm}</Text>
          )}
        </View>

        {errors.general && (
          <Text style={[styles.errorText, { marginBottom: 10 }]}>
            {errors.general}
          </Text>
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={isLoading}
          tabIndex={0}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.signUpContainer}>
        <Text style={styles.textField}>Already have an Account?</Text>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.signUpButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    signUpContainer: {
      marginTop: 32,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: "#e2e8f0",
    },
    textField: {
      color: "#64748b",
      fontSize: 15,
      fontWeight: "500",
    },
    signUpButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    signUpButtonText: {
      color: "#3b82f6",
      fontSize: 15,
      fontWeight: "600",
      textDecorationLine: "underline",
    },
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
    webLayout: {
      flex: 1,
      flexDirection: "row",
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
    },
    formContainer: {
      flex: 0.4,
      padding: 24,
      justifyContent: "center",
      backgroundColor: "#ffffff",
      margin: 16,
    },
    webFormContainer: {
      flex: 0.4,
      justifyContent: "center",
      alignItems: "center",
    },
    mobileScrollView: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
    mobileLayout: {
      paddingVertical: 20,
      minHeight: Platform.select({ web: "100%", default: "auto" }),
    },
    formWrapper: {
      width: "100%",
      height: "auto",
      maxWidth: 440,
      backgroundColor: "#ffffff",
      padding: Platform.select({ web: 40, default: 20 }),
      borderRadius: 24,
      alignSelf: "center",
    },
    imageContainer: {
      flex: Platform.select({ web: 0.6, default: 0.6 }),
      overflow: "hidden",
      backgroundColor: "#000000",
    },
    image: {
      width: "100%",
      height: "100%",
      opacity: 0.8,
    },
    title: {
      fontSize: 36,
      fontWeight: "800",
      marginBottom: 48,
      color: "#0f172a",
      textAlign: "center",
      letterSpacing: -0.5,
    },
    inputContainer: {
      marginBottom: 24,
    },
    label: {
      fontSize: 15,
      marginBottom: 8,
      color: "#334155",
      fontWeight: "600",
      letterSpacing: -0.2,
    },
    input: {
      width: "100%",
      height: 52,
      borderWidth: 1.5,
      borderColor: "#e2e8f0",
      borderRadius: 12,
      paddingHorizontal: 18,
      backgroundColor: "#ffffff",
      fontSize: 16,
      color: "#0f172a",
      fontWeight: "500",
    },
    button: {
      width: "100%",
      height: 52,
      backgroundColor: "#3b82f6",
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 32,
      boxShadowColor: "#3b82f6",
      boxShadowOffset: { width: 0, height: 4 },
      boxShadowOpacity: 0.2,
      boxShadowRadius: 8,
      elevation: 4,
    },
    buttonText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "600",
      letterSpacing: 0.2,
    },
    errorText: {
      color: "#ef4444",
      fontSize: 14,
      marginTop: 6,
      fontWeight: "500",
    },
    inputError: {
      borderColor: "#ef4444",
      borderWidth: 1.5,
    },
  });

  if (isMobile) {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.mobileScrollView}
          contentContainerStyle={styles.mobileLayout}
          showsVerticalScrollIndicator={true}
        >
          {renderForm()}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.webLayout}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/images/login.jpg")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.webFormContainer}>{renderForm()}</View>
    </View>
  );
};

export default SignUp;
